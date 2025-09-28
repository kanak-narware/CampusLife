import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { assignments } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const priorityVariant: { [key: string]: "destructive" | "secondary" | "outline" } = {
  'High': 'destructive',
  'Medium': 'secondary',
  'Low': 'outline',
};

export function UpcomingAssignments() {
  const upcoming = assignments
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Assignments</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/assignments">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {upcoming.length > 0 ? (
          <ul className="space-y-4">
            {upcoming.map((assignment) => (
              <li key={assignment.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border">
                <div className="flex-grow">
                  <p className="font-semibold">{assignment.title}</p>
                  <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <Badge variant={priorityVariant[assignment.priority]}>{assignment.priority}</Badge>
                  <div className="text-sm text-right w-28">
                    <p className="font-medium">{format(new Date(assignment.dueDate), "MMM d")}</p>
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
           <div className="text-center text-muted-foreground py-8">
            <p>No upcoming assignments. Great job staying on top of your work!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
