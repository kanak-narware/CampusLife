'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { assignments as allAssignments, subjects } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const priorityVariant: { [key: string]: "destructive" | "secondary" | "outline" } = {
  'High': 'destructive',
  'Medium': 'secondary',
  'Low': 'outline',
};

type SortOption = 'dueDate' | 'priority';
type Filter = {
  subject: string;
  priority: string;
};

export default function AssignmentsPage() {
  const [sortOption, setSortOption] = useState<SortOption>('dueDate');
  const [filters, setFilters] = useState<Filter>({ subject: 'all', priority: 'all' });

  const filteredAndSortedAssignments = useMemo(() => {
    let filtered = [...allAssignments];

    if (filters.subject !== 'all') {
      filtered = filtered.filter(a => a.subject === filters.subject);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(a => a.priority === filters.priority);
    }

    if (sortOption === 'dueDate') {
      filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } else if (sortOption === 'priority') {
      const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
      filtered.sort((a, b) => priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]);
    }

    return filtered;
  }, [sortOption, filters]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader title="Assignments" description="Keep track of all your tasks and deadlines.">
        <div className="flex items-center gap-2">
          <Select value={filters.subject} onValueChange={(value) => setFilters(f => ({ ...f, subject: value }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filters.priority} onValueChange={(value) => setFilters(f => ({ ...f, priority: value }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOption} onValueChange={(value: SortOption) => setSortOption(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Sort by Due Date</SelectItem>
              <SelectItem value="priority">Sort by Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PageHeader>
      
      {filteredAndSortedAssignments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedAssignments.map(assignment => (
            <Card key={assignment.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  <Badge variant={priorityVariant[assignment.priority]}>{assignment.priority}</Badge>
                </div>
                <CardDescription>{assignment.subject}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{assignment.details}</p>
              </CardContent>
              <CardFooter>
                <div className="text-sm">
                  <p className="font-semibold">Due: {format(new Date(assignment.dueDate), "eeee, MMM d")}</p>
                  <p className="text-muted-foreground">{formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold">No Assignments Found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters or enjoy the free time!</p>
        </div>
      )}
    </div>
  );
}
