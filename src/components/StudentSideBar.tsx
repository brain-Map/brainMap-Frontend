import React from 'react';
import { Calendar, CheckSquare, Folder, Star, FileText } from 'lucide-react';

interface Project {
  name: string;
  count: number;
  color: string;
}

const Sidebar: React.FC = () => {
  const projects: Project[] = [
    { name: 'Flower Shop', count: 23, color: 'bg-yellow-400' },
    { name: 'Cloth', count: 345, color: 'bg-red-500' },
    { name: 'Gamer Boy', count: 568, color: 'bg-orange-500' }
  ];

  const menuItems = [
    { icon: Calendar, label: 'Calendar', active: false },
    { icon: CheckSquare, label: 'Todo', active: false },
    { icon: Folder, label: 'Projects', active: true },
    { icon: Star, label: 'Starred', active: false },
    { icon: FileText, label: 'Notes', active: false }
  ];

  return (
    <div className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Main Navigation */}
      <div className="flex-1">
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <li key={index}>
                  <a
                    href="#"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.active
                        ? 'bg-gray-200 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="mr-3 h-5 w-5" />
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Projects Section */}
        <div className="mt-8 px-4">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Projects
          </h3>
          <div className="mt-4 space-y-2">
            {projects.map((project, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full mr-3 ${project.color}`}></div>
                  <span>{project.name}</span>
                </div>
                <span className="text-xs text-gray-500 font-normal">
                  {project.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;