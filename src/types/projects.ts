interface Project {
  id: string;
  name: string;
  key: string;
  type: string;
  lead: {
    name: string;
    initials: string;
    avatar?: string;
  };
  projectUrl?: string;
  starred: boolean;
  icon: string;
  iconBg: string;
  createdAt?: string;
  deadline?: string;
    description?: string;
    status?: string;
  properies?: {
    [key: string]: any;
  }
}

export default Project;