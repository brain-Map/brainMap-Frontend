import Project from '@/types/projects';

const projects: Project[] = [
  // Existing 13 projects
  {
    id: '1',
    name: 'Project 1',
    key: 'A123',
    type: 'Product Discovery',
    lead: { name: 'Nadun Madusanka', initials: 'NM' },
    starred: true,
    icon: '📊',
    iconBg: 'bg-blue-500',
    createdAt: '2024-01-01',
    deadline: '2024-02-01',
    description: 'This project focuses on the discovery phase of a new product, gathering requirements and defining scope.',
    status: 'In Progress',
     color:'bg-yellow-500',
  },
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `${i + 2}`,
    name: `Project ${i + 2}`,
    key: 'A124',
    type: 'Team-managed software',
    lead: { name: 'Nadun Madusanka', initials: 'NM' },
    starred: false,
    icon: '📋',
    iconBg: 'bg-cyan-500',
    createdAt: '2024-01-15',
    deadline: '2024-02-01',
    description: 'Replace your hardcoded project details with the values from the project object. This will ensure the page displays the correct project based on the URL parameter. Let me know if you want a full code patch!',
    status: 'In Progress',
         color:'bg-green-500',

  })),

  // Additional 9 projects (14 to 22)
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `${i + 14}`,
    name: `Project ${i + 14}`,
    key: 'A125',
    type: 'Agile Development',
    lead: { name: 'Nadun Madusanka', initials: 'NM' },
    starred: i % 2 === 0,
    icon: '🚀',
    iconBg: 'bg-green-500',
    createdAt: '2024-02-01',
    deadline: '2024-03-01',
    description: 'This is a continuation of the agile development phase, including sprint planning, execution, and retrospectives.',
    status: i % 2 === 0 ? 'In Progress' : 'Planning',
    color:'bg-blue-500',

  })),
];

export default projects;
