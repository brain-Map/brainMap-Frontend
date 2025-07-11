import Project from '@/types/projects';

const projects: Project[] = [
    {
      id: '1',
      name: 'Project 1',
      key: 'A123',
      type: 'Product Discovery',
      lead: {
        name: 'Nadun Madusanka',
        initials: 'NM'
      },
      starred: true,
      icon: '📊',
      iconBg: 'bg-blue-500',
      createdAt: '2024-01-1',
      deadline: '2024-02-1',
      description: 'This project focuses on the discovery phase of a new product, gathering requirements and defining scope.',
      status: 'In Progress',


    },
    {
      id: '2',
      name: 'Project 2',
      key: 'A124',
      type: 'Team-managed software',
      lead: {
        name: 'Nadun Madusanka',
        initials: 'NM'
      },
      starred: false,
      icon: '📋',
      iconBg: 'bg-cyan-500',
      createdAt: '2024-01-15',
      deadline: '2024-02-1',
      description: 'Replace your hardcoded project details with the values from the project object. This will ensure the page displays the correct project based on the URL parameter. Let me know if you want a full code patch!',
      status: 'In Progress',
    }
  ];

export default projects;