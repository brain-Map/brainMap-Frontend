'use client';
import React, { useState } from 'react';
import { Search, ChevronDown, Star, MoreHorizontal, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import TodoNotesSidebar from '@/components/TodoNotesSidebar';


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
}

const ProjectsTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProduct, setFilterProduct] = useState('Filter by product');
  
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
      iconBg: 'bg-blue-500'
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
      iconBg: 'bg-cyan-500'
    }
  ];

  const toggleStar = (projectId: string) => {
    // In a real app, this would update the project's starred status
    console.log(`Toggle star for project ${projectId}`);
  };

  return (
    <div className="min-h-screen flex justify-between ">
      <div className='w-full p-6'>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <div className="flex items-center gap-3">
            <button className="bg-primary hover:bg-secondary text-white hover:text-black px-4 py-2 rounded-md font-medium transition-colors">
              Create project
            </button>

          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          
          <div className="relative">
            <select 
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer"
            >
              <option>Filter by product</option>
              <option>Product Discovery</option>
              <option>Team-managed software</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Name</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Key</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Lead</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Project URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleStar(project.id)}
                        className={`p-1 rounded transition-colors ${
                          project.starred 
                            ? 'text-yellow-500 hover:text-yellow-600' 
                            : 'text-gray-300 hover:text-gray-400'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${project.starred ? 'fill-current' : ''}`} />
                      </button>
                      <div className={`w-6 h-6 rounded ${project.iconBg} flex items-center justify-center text-white text-sm`}>
                        {project.icon}
                      </div>
                      <span className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors">
                        {project.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{project.key}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{project.type}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {project.lead.initials}
                      </div>
                      <span className="text-sm text-gray-900">{project.lead.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center mt-6">
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium">
              1
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>


    <div className="min-h-screen ml-6 bg-accent">
      <TodoNotesSidebar />
    </div>












    </div>
  );
};

export default ProjectsTable;