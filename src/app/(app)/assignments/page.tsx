'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { assignments as allAssignments, subjects } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Assignment } from '@/lib/types';
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';

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
  const [assignments, setAssignments] = useState<Assignment[]>(allAssignments);
  const [sortOption, setSortOption] = useState<SortOption>('dueDate');
  const [filters, setFilters] = useState<Filter>({ subject: 'all', priority: 'all' });
  const [newChecklistItem, setNewChecklistItem] = useState<Record<string, string>>({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [formState, setFormState] = useState<Partial<Assignment> | null>(null);
  const { toast } = useToast();

  const handleChecklistItemToggle = (assignmentId: string, checklistItemId: string) => {
    setAssignments(assignments.map(assignment => {
      if (assignment.id === assignmentId) {
        return {
          ...assignment,
          checklist: assignment.checklist?.map(item => {
            if (item.id === checklistItemId) {
              return { ...item, completed: !item.completed };
            }
            return item;
          })
        };
      }
      return assignment;
    }));
  };

  const handleAddChecklistItem = (assignmentId: string) => {
    const text = newChecklistItem[assignmentId]?.trim();
    if (!text) return;

    setAssignments(assignments.map(assignment => {
      if (assignment.id === assignmentId) {
        const newItem = {
          id: `cl-${assignment.id}-${Date.now()}`,
          text,
          completed: false,
        };
        return {
          ...assignment,
          checklist: [...(assignment.checklist || []), newItem],
        };
      }
      return assignment;
    }));

    setNewChecklistItem({ ...newChecklistItem, [assignmentId]: '' });
  };

  const handleDeleteChecklistItem = (assignmentId: string, checklistItemId: string) => {
    setAssignments(assignments.map(assignment => {
      if (assignment.id === assignmentId) {
        return {
          ...assignment,
          checklist: assignment.checklist?.filter(item => item.id !== checklistItemId),
        };
      }
      return assignment;
    }));
  };

  const handleEdit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setFormState({ 
      ...assignment, 
      // Format for date input which expects 'YYYY-MM-DD'
      dueDate: new Date(assignment.dueDate).toISOString().split('T')[0] 
    });
    setIsEditDialogOpen(true);
  };

  const handleFormChange = (field: keyof Omit<Assignment, 'id' | 'checklist'>, value: string) => {
    if (formState) {
      setFormState({ ...formState, [field]: value });
    }
  };

  const handleSave = () => {
    if (!formState || !formState.title || !formState.subject || !formState.dueDate || !formState.priority || !formState.details) {
      toast({ variant: 'destructive', title: "Missing fields", description: "Please fill out all fields."});
      return;
    }

    if (selectedAssignment) {
      setAssignments(assignments.map(a => 
        a.id === selectedAssignment.id 
        ? { 
            ...a, 
            ...formState, 
            // Convert date back to ISO string on save
            dueDate: new Date(formState.dueDate!).toISOString() 
          } as Assignment 
        : a
      ));
      toast({ title: "Assignment updated", description: "Your assignment has been updated." });
    }
    
    setIsEditDialogOpen(false);
    setFormState(null);
    setSelectedAssignment(null);
  };

  const filteredAndSortedAssignments = useMemo(() => {
    let filtered = [...assignments];

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
  }, [sortOption, filters, assignments]);

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
                  <div className="flex items-center gap-1">
                    <Badge variant={priorityVariant[assignment.priority]}>{assignment.priority}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(assignment)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardDescription>{assignment.subject}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{assignment.details}</p>
                {assignment.checklist && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold">Checklist</h4>
                      {assignment.checklist.map(item => (
                        <div key={item.id} className="flex items-center gap-2">
                          <Checkbox
                            id={`item-${item.id}`}
                            checked={item.completed}
                            onCheckedChange={() => handleChecklistItemToggle(assignment.id, item.id)}
                          />
                          <label
                            htmlFor={`item-${item.id}`}
                            className={`flex-grow text-sm ${item.completed ? 'text-muted-foreground line-through' : ''}`}
                          >
                            {item.text}
                          </label>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteChecklistItem(assignment.id, item.id)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          placeholder="Add new item..."
                          value={newChecklistItem[assignment.id] || ''}
                          onChange={(e) => setNewChecklistItem({ ...newChecklistItem, [assignment.id]: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddChecklistItem(assignment.id)}
                        />
                        <Button size="icon" onClick={() => handleAddChecklistItem(assignment.id)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" value={formState?.title || ''} onChange={(e) => handleFormChange('title', e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">Subject</Label>
              <Select value={formState?.subject || ''} onValueChange={(value) => handleFormChange('subject', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="details" className="text-right">Details</Label>
              <Textarea id="details" value={formState?.details || ''} onChange={(e) => handleFormChange('details', e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">Due Date</Label>
              <Input id="dueDate" type="date" value={formState?.dueDate || ''} onChange={(e) => handleFormChange('dueDate', e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">Priority</Label>
              <Select value={formState?.priority || ''} onValueChange={(value) => handleFormChange('priority', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
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
