'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar,
  Kanban,
  List,
  BarChart3,
  ArrowUpDown,
  Plus,
  Filter,
  Search,
  Download,
  Check,
  MoreHorizontal,
  Folder,
  Hash,
  Settings,
  Edit3,
  Trash2,
  Copy,
  Zap
} from 'lucide-react';

interface TableItem {
  id: number;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive';
  lastModified: string;
}

// Simple table row component
const SimpleTableRow = ({ 
  id, 
  isSelected, 
  onToggleSelect, 
  onClick, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  className = "", 
  children 
}: {
  id: number;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  onClick: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onDuplicate: (id: number) => void;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={`flex items-center w-full ${className}`}>
      {/* Checkbox */}
      <div className="flex items-center justify-center w-12 h-14 shrink-0">
        <button
          onClick={() => onToggleSelect(id)}
          className={`
            flex items-center justify-center w-4 h-4 rounded border transition-all duration-200
            ${isSelected 
              ? 'bg-blue-500 border-blue-500 text-white' 
              : 'border-gray-300 hover:border-blue-400 bg-white'
            }
          `}
        >
          {isSelected && <Check size={12} />}
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 cursor-pointer" onClick={() => onClick(id)}>
        {children}
      </div>
      
      {/* Actions */}
      <div className="w-12 flex items-center justify-center">
        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
          <MoreHorizontal size={16} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default function ListBoardPage() {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set([1, 2, 4, 5, 6]));
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('Kanban');

  const router = useRouter();

  // Sample data matching the image
  const tableItems: TableItem[] = [
    { id: 1, name: 'Bold text column', description: 'Regular text column', category: 'Regular text column', status: 'active', lastModified: 'Regular text column' },
    { id: 2, name: 'Bold text column', description: 'Regular text column', category: 'Regular text column', status: 'active', lastModified: 'Regular text column' },
    { id: 3, name: 'Bold text column', description: 'Regular text column', category: 'Regular text column', status: 'inactive', lastModified: 'Regular text column' },
    { id: 4, name: 'Bold text column', description: 'Regular text column', category: 'Regular text column', status: 'active', lastModified: 'Regular text column' },
    { id: 5, name: 'Bold text column', description: 'Regular text column', category: 'Regular text column', status: 'inactive', lastModified: 'Regular text column' },
    { id: 6, name: 'Bold text column', description: 'Regular text column', category: 'Regular text column', status: 'active', lastModified: 'Regular text column' },
    { id: 7, name: 'Bold text column', description: 'Regular text column', category: 'Regular text column', status: 'active', lastModified: 'Regular text column' },
    { id: 8, name: 'Bold text column', description: 'Regular text column', category: 'Regular text column', status: 'inactive', lastModified: 'Regular text column' },
    { id: 9, name: 'Bold text column', description: 'Regular text column', category: 'Regular text column', status: 'active', lastModified: 'Regular text column' },
    { id: 10, name: 'Bold text column', description: 'Regular text column', category: 'Regular text column', status: 'active', lastModified: 'Regular text column' },
    { id: 11, name: 'Bold text column', description: 'Regular text column', category: 'Regular text column', status: 'inactive', lastModified: 'Regular text column' },
    { id: 12, name: 'Bold text column', description: 'Regular text column', category: 'Regular text column', status: 'active', lastModified: 'Regular text column' },
    { id: 13, name: 'Bold text column', description: 'Regular text column', category: 'Regular text column', status: 'inactive', lastModified: 'Regular text column' },
    { id: 14, name: 'Bold text column', description: 'Regular text column', category: 'Regular text column', status: 'active', lastModified: 'Regular text column' },
  ];

  const filteredItems = tableItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleSelect = (id: string | number) => {
    const newSelected = new Set(selectedItems);
    const numId = typeof id === 'string' ? parseInt(id) : id;
    if (newSelected.has(numId)) {
      newSelected.delete(numId);
    } else {
      newSelected.add(numId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const handleRowClick = (id: string | number) => {
    console.log('Row clicked:', id);
  };

  const handleEdit = (id: string | number) => {
    console.log('Edit item:', id);
  };

  const handleDelete = (id: string | number) => {
    console.log('Delete item:', id);
  };

  const handleDuplicate = (id: string | number) => {
    console.log('Duplicate item:', id);
  };

  const viewTabs = [
    { name: 'Summary', icon: BarChart3, active: false },
    { name: 'Calendar', icon: Calendar, active: false },
    { name: 'Kanban', icon: Kanban, active: true },
    { name: 'List', icon: List, active: false },
  ];

  const handleViewChange = (viewName: string) => {
    setActiveView(viewName);
    
    if (viewName === 'Calendar') {
      router.push('/calendar');
      return;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        {/* Project Header */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded opacity-90"></div>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Cloth</h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mt-0.5">
                    <Folder size={12} />
                    <span>Projects</span>
                    <span>•</span>
                    <Hash size={12} />
                    <span>Fashion</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings size={18} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="px-6">
          <div className="flex space-x-1 border-b border-gray-200">
            {viewTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.name}
                  onClick={() => handleViewChange(tab.name)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                    tab.name === activeView
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <IconComponent size={16} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Table Header Controls */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-semibold text-gray-900">Project Tasks</h2>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                  {filteredItems.length} items
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Search */}
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  />
                </div>
                
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter size={16} className="text-gray-600" />
                </button>
                
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download size={16} className="text-gray-600" />
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Plus size={16} />
                  <span>Add Task</span>
                </button>
              </div>
            </div>
          </div>

          {/* Column Headers */}
          <div className="flex items-center w-full bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
            {/* Select All Checkbox */}
            <div className="flex items-center justify-center w-12 h-12 shrink-0">
              <button
                onClick={handleSelectAll}
                className={`
                  flex items-center justify-center w-4 h-4 rounded border transition-all duration-200
                  ${
                    selectedItems.size === filteredItems.length && filteredItems.length > 0
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : selectedItems.size > 0
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-300 hover:border-blue-400 bg-white'
                  }
                `}
              >
                {selectedItems.size > 0 && (
                  selectedItems.size === filteredItems.length ? (
                    <Check size={12} className="text-white" />
                  ) : (
                    <div className="w-1.5 h-1.5 bg-white rounded-sm" />
                  )
                )}
              </button>
            </div>

            <div className="flex items-center px-4 py-3 flex-1 cursor-pointer hover:bg-gray-100 transition-colors">
              <span>Column heading</span>
              <ArrowUpDown size={14} className="ml-2 text-gray-400" />
            </div>
            
            <div className="flex items-center px-4 py-3 w-48 cursor-pointer hover:bg-gray-100 transition-colors">
              <span>Column heading</span>
              <ArrowUpDown size={14} className="ml-2 text-gray-400" />
            </div>
            
            <div className="flex items-center px-4 py-3 w-48 cursor-pointer hover:bg-gray-100 transition-colors">
              <span>Column heading</span>
              <ArrowUpDown size={14} className="ml-2 text-gray-400" />
            </div>
            
            <div className="flex items-center px-4 py-3 w-32 cursor-pointer hover:bg-gray-100 transition-colors">
              <span>Column heading</span>
              <ArrowUpDown size={14} className="ml-2 text-gray-400" />
            </div>
            
            <div className="flex items-center px-4 py-3 w-48 cursor-pointer hover:bg-gray-100 transition-colors">
              <span>Column heading</span>
              <ArrowUpDown size={14} className="ml-2 text-gray-400" />
            </div>
            
            <div className="w-12"></div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <SimpleTableRow
                key={item.id}
                id={item.id}
                isSelected={selectedItems.has(item.id)}
                onToggleSelect={handleToggleSelect}
                onClick={handleRowClick}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                className="hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4 px-4 py-3">
                  {/* First Column - Bold text */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {item.name}
                    </div>
                  </div>
                  
                  {/* Second Column - Regular text */}
                  <div className="w-48 min-w-0">
                    <div className="text-gray-600 truncate">
                      {item.description}
                    </div>
                  </div>
                  
                  {/* Third Column - Regular text */}
                  <div className="w-48 min-w-0">
                    <div className="text-gray-600 truncate">
                      {item.category}
                    </div>
                  </div>
                  
                  {/* Fourth Column - Status */}
                  <div className="w-32">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.status === 'active' 
                            ? 'bg-green-500' 
                            : 'bg-gray-400'
                        }`}
                      />
                      <span
                        className={`text-sm font-medium capitalize ${
                          item.status === 'active' ? 'text-green-600' : 'text-gray-600'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Fifth Column - Last Modified */}
                  <div className="w-48 min-w-0">
                    <div className="text-gray-600 truncate">
                      {item.lastModified}
                    </div>
                  </div>
                </div>
              </SimpleTableRow>
            ))}
          </div>

          {/* Selection Footer */}
          {selectedItems.size > 0 && (
            <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-blue-700">
                    {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setSelectedItems(new Set())}
                    className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear Selection
                  </button>
                  <button className="px-3 py-1.5 text-sm border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors">
                    <Edit3 size={14} className="inline mr-1" />
                    Bulk Edit
                  </button>
                  <button className="px-3 py-1.5 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 size={14} className="inline mr-1" />
                    Delete Selected
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <div className="text-lg font-medium text-gray-900 mb-2">No tasks found</div>
                <div className="text-sm text-gray-500">
                  Try adjusting your search terms or add a new task to get started
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}