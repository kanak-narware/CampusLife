import type { Subject, Assignment, TimetableEntry, ChecklistItem } from './types';

export const subjects: Subject[] = [
  { id: 'subj-1', name: 'Advanced Calculus', teacher: 'Dr. Evelyn Reed', totalClasses: 20, attendedClasses: 18 },
  { id: 'subj-2', name: 'Quantum Physics', teacher: 'Prof. Alistair Finch', totalClasses: 22, attendedClasses: 21 },
  { id: 'subj-3', name: 'Literary Theory', teacher: 'Dr. Isabella Rossi', totalClasses: 18, attendedClasses: 15 },
  { id: 'subj-4', name: 'Organic Chemistry', teacher: 'Prof. Kenji Tanaka', totalClasses: 25, attendedClasses: 24 },
  { id: 'subj-5', name: 'Data Structures', teacher: 'Prof. Maya Chen', totalClasses: 24, attendedClasses: 20 },
];

export const assignments: Assignment[] = [
  {
    id: 'assign-1',
    title: 'Problem Set 3',
    subject: 'Advanced Calculus',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'High',
    details: 'Complete exercises 4.1-4.5 from the textbook. Show all work for partial credit.',
    checklist: [
      { id: 'cl-1-1', text: 'Solve exercise 4.1', completed: true },
      { id: 'cl-1-2', text: 'Solve exercise 4.2', completed: false },
      { id: 'cl-1-3', text: 'Review chapter on integrals', completed: false },
    ]
  },
  {
    id: 'assign-2',
    title: 'Lab Report: Wave-Particle Duality',
    subject: 'Quantum Physics',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'High',
    details: 'Analyze experimental data and write a 10-page report on the findings.',
    checklist: [
      { id: 'cl-2-1', text: 'Draft introduction', completed: true },
      { id: 'cl-2-2', text: 'Analyze data from experiment A', completed: false },
      { id: 'cl-2-3', text: 'Write conclusion', completed: false },
    ]
  },
  {
    id: 'assign-3',
    title: 'Essay on Post-structuralism',
    subject: 'Literary Theory',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'Medium',
    details: 'A 2000-word essay comparing Derrida and Foucault.'
  },
  {
    id: 'assign-4',
    title: 'Binary Tree Implementation',
    subject: 'Data Structures',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'Medium',
    details: 'Implement a balanced binary search tree in Java or Python.',
    checklist: [
        { id: 'cl-4-1', text: 'Implement Node class', completed: true },
        { id: 'cl-4-2', text: 'Implement insert method', completed: true },
        { id: 'cl-4-3', text: 'Implement balancing logic', completed: false },
        { id: 'cl-4-4', text: 'Write test cases', completed: false },
    ]
  },
  {
    id: 'assign-5',
    title: 'Synthesis of Aspirin',
    subject: 'Organic Chemistry',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'Low',
    details: 'Prepare for the upcoming lab on the synthesis of acetylsalicylic acid.'
  },
];

export const timetable: TimetableEntry[] = [
  { id: 'tt-1', day: 'Monday', time: '09:00 - 10:30', subjectName: 'Advanced Calculus', location: 'Hall A, Room 101' },
  { id: 'tt-2', day: 'Monday', time: '11:00 - 12:30', subjectName: 'Quantum Physics', location: 'Physics Lab 2' },
  { id: 'tt-3', day: 'Tuesday', time: '10:00 - 11:30', subjectName: 'Literary Theory', location: 'Humanities Bldg, Rm 203' },
  { id: 'tt-4', day: 'Tuesday', time: '13:00 - 14:30', subjectName: 'Data Structures', location: 'CS Bldg, Lab 5' },
  { id: 'tt-5', day: 'Wednesday', time: '09:00 - 10:30', subjectName: 'Advanced Calculus', location: 'Hall A, Room 101' },
  { id: 'tt-6', day: 'Wednesday', time: '14:00 - 16:00', subjectName: 'Organic Chemistry', location: 'Chem Lab 1' },
  { id: 'tt-7', day: 'Thursday', time: '10:00 - 11:30', subjectName: 'Literary Theory', location: 'Humanities Bldg, Rm 203' },
  { id: 'tt-8', day: 'Thursday', time: '13:00 - 14:30', subjectName: 'Data Structures', location: 'CS Bldg, Lab 5' },
  { id: 'tt-9', day: 'Friday', time: '11:00 - 12:30', subjectName: 'Quantum Physics', location: 'Physics Lab 2' },
  { id: 'tt-10', day: 'Friday', time: '14:00 - 16:00', subjectName: 'Organic Chemistry', location: 'Chem Lab 1' },
];
