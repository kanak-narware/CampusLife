'use client';

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { timetable as initialTimetable } from "@/lib/data";
import type { TimetableEntry } from "@/lib/types";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

type TimetableFormState = Omit<TimetableEntry, 'id'> | Partial<TimetableEntry>;

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>(initialTimetable);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | null>(null);
  const [formState, setFormState] = useState<TimetableFormState | null>(null);

  const { toast } = useToast();

  const handleAdd = () => {
    setSelectedEntry(null);
    setFormState({
      day: 'Monday',
      time: '',
      subjectName: '',
      location: '',
    });
    setIsEditDialogOpen(true);
  };

  const handleEdit = (entry: TimetableEntry) => {
    setSelectedEntry(entry);
    setFormState({ ...entry });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (entry: TimetableEntry) => {
    setSelectedEntry(entry);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedEntry) return;
    setTimetable(timetable.filter(e => e.id !== selectedEntry.id));
    toast({ title: "Entry deleted", description: `${selectedEntry.subjectName} has been removed from your timetable.` });
    setIsDeleteDialogOpen(false);
    setSelectedEntry(null);
  };
  
  const handleFormChange = (field: keyof TimetableFormState, value: string) => {
    if (formState) {
      setFormState({ ...formState, [field]: value });
    }
  };

  const handleSave = () => {
    if (!formState || !formState.subjectName || !formState.time || !formState.day || !formState.location) {
      toast({ variant: 'destructive', title: "Missing fields", description: "Please fill out all fields."});
      return;
    }

    if (selectedEntry) {
      // Edit
      setTimetable(timetable.map(e => e.id === selectedEntry.id ? { ...selectedEntry, ...formState, id: selectedEntry.id } as TimetableEntry : e));
      toast({ title: "Entry updated", description: "Your timetable has been updated." });
    } else {
      // Add
      const newEntry: TimetableEntry = {
        id: `tt-${Date.now()}`,
        ...formState as Omit<TimetableEntry, 'id'>,
      };
      setTimetable([...timetable, newEntry]);
      toast({ title: "Entry added", description: `${newEntry.subjectName} has been added to your timetable.` });
    }
    setIsEditDialogOpen(false);
    setFormState(null);
    setSelectedEntry(null);
  };
  
  const sortedTimetable = [...timetable].sort((a,b) => {
    const dayCompare = daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
    if (dayCompare !== 0) return dayCompare;
    const timeA = parseInt(a.time.split(':')[0]);
    const timeB = parseInt(b.time.split(':')[0]);
    return timeA - timeB;
  });

  const dynamicTimeSlots = Array.from(new Set(sortedTimetable.map(item => item.time)))
    .sort((a, b) => parseInt(a.split(':')[0]) - parseInt(b.split(':')[0]));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Timetable"
        description="Your weekly class schedule at a glance."
      >
        <Button onClick={handleAdd}><Plus className="mr-2"/> Add Class</Button>
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">Time</TableHead>
                  {daysOfWeek.map(day => (
                    <TableHead key={day}>{day}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {dynamicTimeSlots.map(time => (
                  <TableRow key={time}>
                    <TableCell className="font-semibold">{time}</TableCell>
                    {daysOfWeek.map(day => {
                      const entry = sortedTimetable.find(e => e.day === day && e.time === time);
                      return (
                        <TableCell key={day}>
                          {entry ? (
                            <div className="group relative p-2 rounded-lg bg-accent/50 border border-accent">
                              <p className="font-bold text-accent-foreground">{entry.subjectName}</p>
                              <p className="text-sm text-muted-foreground">{entry.location}</p>
                              <div className="absolute top-1 right-1">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleEdit(entry)}>
                                      <Pencil className="mr-2 h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(entry)} className="text-destructive focus:text-destructive-foreground">
                                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          ) : null}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEntry ? 'Edit Timetable Entry' : 'Add New Class'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subjectName" className="text-right">Subject</Label>
              <Input id="subjectName" value={formState?.subjectName || ''} onChange={(e) => handleFormChange('subjectName', e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Location</Label>
              <Input id="location" value={formState?.location || ''} onChange={(e) => handleFormChange('location', e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">Time</Label>
              <Input id="time" value={formState?.time || ''} placeholder="e.g., 09:00 - 10:30" onChange={(e) => handleFormChange('time', e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="day" className="text-right">Day</Label>
              <Select value={formState?.day || ''} onValueChange={(value) => handleFormChange('day', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the class "{selectedEntry?.subjectName}" from your timetable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
