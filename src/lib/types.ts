export type Subject = {
  id: string;
  name: string;
  teacher: string;
  totalClasses: number;
  attendedClasses: number;
};

export type TimetableEntry = {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  time: string;
  subjectName: string;
  location: string;
};

export type Assignment = {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  details: string;
};
