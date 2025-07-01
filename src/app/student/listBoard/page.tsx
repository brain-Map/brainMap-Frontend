'use client';

import React, { useState } from 'react';
import SimpleTableRow from '@/components/SimpleTableRow';
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
    
    // Navigate to calendar page when Calendar tab is clicked
    if (viewName === 'Calendar') {
      router.push('/calendar');
      return;
    }
    
    // Handle other view changes here if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="bg-white/90 backdrop-blur-sm border-b border-value2 shadow-sm">
        {/* Project Header */}
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-accent to-info rounded-xl shadow-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-lg opacity-90"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Cloth</h1>
                  <div className="flex items-center space-x-2 text-sm text-value1 mt-1">
                    <Folder size={14} />
                    <span>Projects</span>
                    <span className="text-value2">•</span>
                    <Hash size={14} />
                    <span>Fashion</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="group p-2.5 hover:bg-gradient-to-r hover:from-value3 hover:to-value2 rounded-xl transition-all duration-300 transform hover:scale-105">
                <Settings size={18} className="text-value1 group-hover:text-primary transition-colors" />
              </button>
              <button className="group p-2.5 hover:bg-gradient-to-r hover:from-value3 hover:to-value2 rounded-xl transition-all duration-300 transform hover:scale-105">
                <MoreHorizontal size={18} className="text-value1 group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="px-6">
          <div className="flex space-x-1 border-b border-value2">
            {viewTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.name}
                  onClick={() => handleViewChange(tab.name)}
                  className={`group relative flex items-center space-x-2 px-5 py-4 rounded-t-xl text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                    tab.name === activeView
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25'
                      : 'text-value1 hover:bg-gradient-to-r hover:from-value3 hover:to-value2 hover:text-primary'
                  }`}
                >
                  {tab.name === activeView && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 rounded-t-xl blur opacity-30"></div>
                  )}
                  <IconComponent size={16} className="relative z-10" />
                  <span className="relative z-10">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-value2 shadow-xl overflow-hidden">
          {/* Table Header Controls */}
          <div className="px-6 py-5 border-b border-value2 bg-gradient-to-r from-white to-value3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <Zap size={16} className="text-accent" />
                  <h2 className="text-xl font-bold text-gray-900">Project Tasks</h2>
                </div>
                <div className="px-3 py-1.5 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full text-sm font-medium">
                  {filteredItems.length} items
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Search */}
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-value1" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-value2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 w-64 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                
                <button className="group p-2.5 border border-value2 rounded-xl hover:bg-gradient-to-r hover:from-value3 hover:to-value2 transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm">
                  <Filter size={16} className="text-value1 group-hover:text-primary transition-colors" />
                </button>
                
                <button className="group p-2.5 border border-value2 rounded-xl hover:bg-gradient-to-r hover:from-value3 hover:to-value2 transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm">
                  <Download size={16} className="text-value1 group-hover:text-primary transition-colors" />
                </button>
                
                <button className="group relative flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 font-medium">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <Plus size={16} className="relative z-10" />
                  <span className="relative z-10">Add Task</span>
                </button>
              </div>
            </div>
          </div>

          {/* Column Headers */}
          <div className="flex items-center w-full bg-gradient-to-r from-gray-50 to-value3 border-b border-value2 text-sm font-semibold text-gray-700">
            {/* Select All Checkbox */}
            <div className="flex items-center justify-center w-12 h-14 shrink-0">
              <button
                onClick={handleSelectAll}
                className={`
                  flex items-center justify-center w-5 h-5 rounded-lg border-2 
                  transition-all duration-300 transform hover:scale-110
                  ${
                    selectedItems.size === filteredItems.length && filteredItems.length > 0
                      ? 'bg-gradient-to-r from-primary to-secondary border-primary text-white shadow-lg shadow-primary/25'
                      : selectedItems.size > 0
                      ? 'bg-gradient-to-r from-primary to-secondary border-primary text-white shadow-lg shadow-primary/25'
                      : 'border-value2 hover:border-primary bg-white hover:bg-value3'
                  }
                `}
              >
                {selectedItems.size > 0 && (
                  selectedItems.size === filteredItems.length ? (
                    <Check size={12} className="text-white drop-shadow-sm" />
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-sm shadow-sm" />
                  )
                )}
              </button>
            </div>

            <div className="flex items-center px-4 py-4 flex-1 group cursor-pointer hover:bg-white/50 transition-all duration-300">
              <span className="group-hover:text-primary transition-colors">Column heading</span>
              <ArrowUpDown size={14} className="ml-2 text-value1 group-hover:text-primary transition-colors" />
            </div>
            
            <div className="flex items-center px-4 py-4 w-48 group cursor-pointer hover:bg-white/50 transition-all duration-300">
              <span className="group-hover:text-primary transition-colors">Column heading</span>
              <ArrowUpDown size={14} className="ml-2 text-value1 group-hover:text-primary transition-colors" />
            </div>
            
            <div className="flex items-center px-4 py-4 w-48 group cursor-pointer hover:bg-white/50 transition-all duration-300">
              <span className="group-hover:text-primary transition-colors">Column heading</span>
              <ArrowUpDown size={14} className="ml-2 text-value1 group-hover:text-primary transition-colors" />
            </div>
            
            <div className="flex items-center px-4 py-4 w-32 group cursor-pointer hover:bg-white/50 transition-all duration-300">
              <span className="group-hover:text-primary transition-colors">Column heading</span>
              <ArrowUpDown size={14} className="ml-2 text-value1 group-hover:text-primary transition-colors" />
            </div>
            
            <div className="flex items-center px-4 py-4 w-48 group cursor-pointer hover:bg-white/50 transition-all duration-300">
              <span className="group-hover:text-primary transition-colors">Column heading</span>
              <ArrowUpDown size={14} className="ml-2 text-value1 group-hover:text-primary transition-colors" />
            </div>
            
            <div className="w-12"></div> {/* Actions column */}
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-value2">
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
                className="min-h-[60px] hover:bg-gradient-to-r hover:from-value3 hover:to-white transition-all duration-300"
              >
                <div className="flex items-center space-x-4 px-4 py-2">
                  {/* First Column - Bold text */}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 truncate">
                      {item.name}
                    </div>
                  </div>
                  
                  {/* Second Column - Regular text */}
                  <div className="w-48 min-w-0">
                    <div className="text-value1 truncate">
                      {item.description}
                    </div>
                  </div>
                  
                  {/* Third Column - Regular text */}
                  <div className="w-48 min-w-0">
                    <div className="text-value1 truncate">
                      {item.category}
                    </div>
                  </div>
                  
                  {/* Fourth Column - Status */}
                  <div className="w-32">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                          item.status === 'active' 
                            ? 'bg-gradient-to-r from-success to-info shadow-success/25' 
                            : 'bg-gradient-to-r from-gray-400 to-gray-500'
                        }`}
                      />
                      <span
                        className={`text-sm font-semibold capitalize ${
                          item.status === 'active' ? 'text-success' : 'text-value1'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Fifth Column - Last Modified */}
                  <div className="w-48 min-w-0">
                    <div className="text-value1 truncate">
                      {item.lastModified}
                    </div>
                  </div>
                </div>
              </SimpleTableRow>
            ))}
          </div>

          {/* Selection Footer */}
          {selectedItems.size > 0 && (
            <div className="px-6 py-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-t border-primary/20 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-primary">
                    {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setSelectedItems(new Set())}
                    className="px-4 py-2 text-sm border border-value2 text-value1 rounded-xl hover:bg-white hover:text-primary hover:border-primary transition-all duration-300 transform hover:scale-105 font-medium"
                  >
                    Clear Selection
                  </button>
                  <button className="group relative px-4 py-2 text-sm border border-primary/30 text-primary rounded-xl hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white transition-all duration-300 transform hover:scale-105 font-medium">
                    <Edit3 size={14} className="inline mr-2" />
                    Bulk Edit
                  </button>
                  <button className="group relative px-4 py-2 text-sm border border-danger/30 text-danger rounded-xl hover:bg-gradient-to-r hover:from-danger hover:to-accent hover:text-white transition-all duration-300 transform hover:scale-105 font-medium">
                    <Trash2 size={14} className="inline mr-2" />
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
                <div className="w-16 h-16 bg-gradient-to-br from-value3 to-value2 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-value1" />
                </div>
                <div className="text-lg font-semibold text-gray-700 mb-2">No tasks found</div>
                <div className="text-sm text-value1 max-w-md">
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