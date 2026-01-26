'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { subjects as initialSubjects, Subject } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Check, MoreVertical, Pencil, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SubjectFormState = {
  name: string;
  teacher: string;
  totalClasses: number;
  attendedClasses: number;
};

export default function AttendancePage() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [formState, setFormState] = useState<Partial<SubjectFormState> | null>(null);


  const handleAttendance = (subjectId: string, action: 'increment' | 'decrement') => {
    setSubjects(prevSubjects =>
      prevSubjects.map(subject => {
        if (subject.id === subjectId) {
          let updatedAttendedClasses = subject.attendedClasses;
          if (action === 'increment') {
            if (subject.attendedClasses < subject.totalClasses) {
              updatedAttendedClasses++;
              toast({
                title: `Marked Present for ${subject.name}`,
                description: `You have now attended ${updatedAttendedClasses} of ${subject.totalClasses} classes.`,
              });
            } else {
              toast({
                title: 'Maximum attendance reached',
                description: 'Cannot attend more classes than the total.',
                variant: 'destructive',
              });
              return subject; // No change
            }
          } else { // decrement
            if (subject.attendedClasses > 0) {
              updatedAttendedClasses--;
               toast({
                title: `Marked Absent for ${subject.name}`,
                variant: 'destructive',
                description: `You have now attended ${updatedAttendedClasses} of ${subject.totalClasses} classes. This removes one attended class.`,
              });
            } else {
              toast({
                title: 'Minimum attendance reached',
                description: 'Cannot have less than 0 attended classes.',
                variant: 'destructive',
              });
              return subject; // No change
            }
          }
          return { ...subject, attendedClasses: updatedAttendedClasses };
        }
        return subject;
      })
    );
  };
  
  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject);
    setFormState({ ...subject });
    setIsEditDialogOpen(true);
  };

  const handleFormChange = (field: keyof SubjectFormState, value: string | number) => {
    if (formState) {
      setFormState({ ...formState, [field]: value });
    }
  };

  const handleSave = () => {
    if (!formState || !formState.name || !formState.teacher || formState.totalClasses === undefined || formState.attendedClasses === undefined) {
      toast({ variant: 'destructive', title: "Missing fields", description: "Please fill out all fields."});
      return;
    }
    
    const totalClasses = Number(formState.totalClasses);
    const attendedClasses = Number(formState.attendedClasses);

    if (isNaN(totalClasses) || isNaN(attendedClasses) || totalClasses < 0 || attendedClasses < 0) {
      toast({ variant: 'destructive', title: "Invalid numbers", description: "Class counts must be positive numbers."});
      return;
    }
    
    if (attendedClasses > totalClasses) {
      toast({ variant: 'destructive', title: "Invalid attendance", description: "Attended classes cannot be more than total classes." });
      return;
    }

    if (selectedSubject) {
      setSubjects(subjects.map(s => 
        s.id === selectedSubject.id 
        ? { 
            ...s, 
            name: formState.name!,
            teacher: formState.teacher!,
            totalClasses: totalClasses,
            attendedClasses: attendedClasses,
          } 
        : s
      ));
      toast({ title: "Subject updated", description: "Your subject details have been updated." });
    }
    
    setIsEditDialogOpen(false);
    setFormState(null);
    setSelectedSubject(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Attendance Tracker"
        description="Monitor your attendance for each subject and stay on track."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map(subject => {
          const percentage = subject.totalClasses > 0 ? Math.round((subject.attendedClasses / subject.totalClasses) * 100) : 0;
          return (
            <Card key={subject.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{subject.name}</CardTitle>
                    <CardDescription>{subject.teacher}</CardDescription>
                  </div>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(subject)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="text-center">
                  <span className="text-3xl font-bold">{percentage}%</span>
                  <p className="text-sm text-muted-foreground">Attendance</p>
                </div>
                <Progress value={percentage} aria-label={`${percentage}% attendance for ${subject.name}`} />
                <div className="flex justify-between text-sm">
                  <span><span className="font-semibold">{subject.attendedClasses}</span> Attended</span>
                  <span><span className="font-semibold">{subject.totalClasses - subject.attendedClasses}</span> Missed</span>
                </div>
              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => handleAttendance(subject.id, 'increment')}>
                  <Check className="mr-2 h-4 w-4" />
                  Present
                </Button>
                <Button variant="destructive" onClick={() => handleAttendance(subject.id, 'decrement')}>
                  <X className="mr-2 h-4 w-4" />
                  Absent
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Subject Name</Label>
              <Input id="name" value={formState?.name || ''} onChange={(e) => handleFormChange('name', e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="teacher" className="text-right">Professor</Label>
              <Input id="teacher" value={formState?.teacher || ''} onChange={(e) => handleFormChange('teacher', e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalClasses" className="text-right">Total Classes</Label>
              <Input id="totalClasses" type="number" value={formState?.totalClasses ?? ''} onChange={(e) => handleFormChange('totalClasses', e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attendedClasses" className="text-right">Attended Classes</Label>
              <Input id="attendedClasses" type="number" value={formState?.attendedClasses ?? ''} onChange={(e) => handleFormChange('attendedClasses', e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
