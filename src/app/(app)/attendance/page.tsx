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
    </div>
  );
}
