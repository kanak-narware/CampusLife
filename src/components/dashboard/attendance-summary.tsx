import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { subjects } from "@/lib/data";

export function AttendanceSummary() {
  const totalClasses = subjects.reduce((acc, s) => acc + s.totalClasses, 0);
  const attendedClasses = subjects.reduce((acc, s) => acc + s.attendedClasses, 0);
  const attendancePercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Attendance</CardTitle>
        <CardDescription>A summary of your attendance across all subjects.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <span className="text-4xl font-bold">{attendancePercentage}%</span>
        </div>
        <Progress value={attendancePercentage} aria-label={`${attendancePercentage}% attendance`} />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Attended: {attendedClasses}</span>
          <span>Total: {totalClasses}</span>
        </div>
      </CardContent>
    </Card>
  );
}
