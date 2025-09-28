import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { timetable } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Clock, MapPin } from "lucide-react";

export function DailyOverview() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  const todaysClasses = timetable.filter(c => c.day === today);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        {todaysClasses.length > 0 ? (
          <ul className="space-y-4">
            {todaysClasses.map((item) => (
              <li key={item.id} className="flex items-start space-x-4 p-3 rounded-lg bg-secondary/50">
                <div className="flex-shrink-0 w-24 text-sm font-semibold text-primary">
                  {item.time}
                </div>
                <div className="flex-grow">
                  <p className="font-semibold">{item.subjectName}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {item.location}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>No classes scheduled for today. Enjoy your day off!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
