'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  ChevronDown,
  Star,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';
import TodoNotesSidebar from '@/components/TodoNotesSidebar';
import projects from '@/data/projects/projects';
import Pagination from '@/components/Pagination';

const ProjectsTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProduct, setFilterProduct] = useState('Filter by product');
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const itemsPerPage = 10;

  const router = useRouter();

  const toggleStar = (projectId: string) => {
    console.log(`Toggle star for project ${projectId}`);
  };

  const handleClick = (projectId: string) => {
    router.push(`/project-member/projects/${projectId}`);
  };

  const handleDelete = (projectId: string) => {
    // Implement your delete logic here
    alert(`Delete project ${projectId}`);
    setDropdownOpenId(null);
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterProduct === 'Filter by product' || project.type === filterProduct)
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentItems = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen flex justify-between">
      <div className="w-full pl-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <button className="bg-primary hover:bg-secondary text-white hover:text-black px-4 py-2 rounded-md font-medium transition-colors">
            Create project
          </button>
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
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Lead</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Project Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.map((project) => (
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
                        <Star
                          className={`w-4 h-4 ${project.starred ? 'fill-current' : ''}`}
                        />
                      </button>
                      
                      <span
                        onClick={() => handleClick(project.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors w-full"
                      >
                        {project.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {project.description
                      ? project.description.length > 50
                        ? project.description.slice(0, 50) + "..."
                        : project.description
                      : ""}
                  </td>
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
                    <div className="relative inline-block text-left">
                      <button
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setDropdownOpenId(dropdownOpenId === project.id ? null : project.id)}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {dropdownOpenId === project.id && (
                        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <button
                            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 text-left rounded-md transition duration-150 ease-in-out"
                            onClick={() => handleDelete(project.id)}
                          >
                            Delete
                          </button>
                        </div>

                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Sidebar */}
      <div className="min-h-screen ml-6 bg-accent">
        <TodoNotesSidebar />
      </div>
    </div>
  );
};

export default ProjectsTable;
