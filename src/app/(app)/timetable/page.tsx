import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { timetable } from "@/lib/data";

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = Array.from(new Set(timetable.map(item => item.time)))
  .sort((a, b) => parseInt(a.split(':')[0]) - parseInt(b.split(':')[0]));

export default function TimetablePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Timetable"
        description="Your weekly class schedule at a glance."
      />
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
                {timeSlots.map(time => (
                  <TableRow key={time}>
                    <TableCell className="font-semibold">{time}</TableCell>
                    {daysOfWeek.map(day => {
                      const entry = timetable.find(e => e.day === day && e.time === time);
                      return (
                        <TableCell key={day}>
                          {entry ? (
                            <div className="p-2 rounded-lg bg-accent/50 border border-accent">
                              <p className="font-bold text-accent-foreground">{entry.subjectName}</p>
                              <p className="text-sm text-muted-foreground">{entry.location}</p>
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
    </div>
  );
}
