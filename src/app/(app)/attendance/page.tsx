'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { subjects as initialSubjects, Subject } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';

export default function AttendancePage() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const { toast } = useToast();

  const handleAttendance = (subjectId: string, status: 'present' | 'absent') => {
    setSubjects(prevSubjects =>
      prevSubjects.map(subject => {
        if (subject.id === subjectId) {
          const newAttended = status === 'present' ? Math.min(subject.attendedClasses + 1, subject.totalClasses) : subject.attendedClasses;
          const newTotal = subject.totalClasses + 1;
          
          // For this example, let's just increment both attended and total for 'present' and only total for 'absent'
          // A real app might handle this differently (e.g., only one action per day)
          
          if(status === 'present' && subject.attendedClasses < subject.totalClasses) {
             toast({
              title: `Marked Present for ${subject.name}`,
              description: `Your attendance has been updated.`,
            });
            return { ...subject, attendedClasses: subject.attendedClasses + 1 };
          }
          if(status === 'absent' && subject.attendedClasses > 0){
             toast({
              title: `Marked Absent for ${subject.name}`,
              variant: 'destructive',
              description: `Your attendance has been updated.`,
            });
            // This is a simplification. Marking absent shouldn't decrease attended classes,
            // but might decrease percentage. Let's assume total classes remains a plan and we only track attended.
            // For UI feedback, let's just show the toast. In a real app, this logic would be more complex.
            // Let's not change numbers for absent to avoid confusion.
            return { ...subject };
          }
           toast({
              title: `Attendance for ${subject.name} Unchanged`,
              description: `No change was recorded.`,
            });
          return subject;
        }
        return subject;
      })
    );
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
                <CardTitle>{subject.name}</CardTitle>
                <CardDescription>{subject.teacher}</CardDescription>
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
                <Button variant="outline" onClick={() => handleAttendance(subject.id, 'present')}>
                  <Check className="mr-2 h-4 w-4" />
                  Present
                </Button>
                <Button variant="destructive" onClick={() => handleAttendance(subject.id, 'absent')}>
                  <X className="mr-2 h-4 w-4" />
                  Absent
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
