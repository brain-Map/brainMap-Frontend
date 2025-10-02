'use client';

import React, { useState } from 'react';
import TableRowComponent from './TableRowComponent';
import { 
  ArrowUpDown, 
  Plus, 
  Filter,
  Search,
  Download
} from 'lucide-react';

interface TableData {
  id: string | number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  category: string;
  lastModified: string;
}

const TableContainer: React.FC = () => {
  // Sample data - replace with your actual data
  const [tableData, setTableData] = useState<TableData[]>([
    {
      id: 1,
      name: 'Bold text column',
      description: 'Regular text column',
      status: 'active',
      category: 'Regular text column',
      lastModified: 'Regular text column'
    },
    {
      id: 2,
      name: 'Bold text column',
      description: 'Regular text column', 
      status: 'active',
      category: 'Regular text column',
      lastModified: 'Regular text column'
    },
    {
      id: 3,
      name: 'Bold text column',
      description: 'Regular text column',
      status: 'inactive',
      category: 'Regular text column',
      lastModified: 'Regular text column'
    },
    {
      id: 4,
      name: 'Bold text column',
      description: 'Regular text column',
      status: 'active',
      category: 'Regular text column',
      lastModified: 'Regular text column'
    },
    {
      id: 5,
      name: 'Bold text column',
      description: 'Regular text column',
      status: 'inactive',
      category: 'Regular text column',
      lastModified: 'Regular text column'
    }
  ]);

  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  // Handle row selection
  const handleRowSelection = (id: string | number, isSelected: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (isSelected) {
      newSelectedRows.add(id);
    } else {
      newSelectedRows.delete(id);
    }
    setSelectedRows(newSelectedRows);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.size === tableData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(tableData.map(item => item.id)));
    }
  };

  // Handle row click
  const handleRowClick = (id: string | number) => {
    console.log('Row clicked:', id);
    // Add your row click logic here
  };

  // Filter data based on search
  const filteredData = tableData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">Cloth</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Projects</span>
              <span>•</span>
              <span>Fashion</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter size={16} className="text-gray-500" />
            </button>
            
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Download size={16} className="text-gray-500" />
            </button>
            
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
              <Plus size={16} />
              <span>Add Row</span>
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
              flex items-center justify-center w-5 h-5 rounded border-2 
              transition-all duration-200
              ${
                selectedRows.size === tableData.length && tableData.length > 0
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : selectedRows.size > 0
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'border-gray-300 hover:border-blue-400 bg-white'
              }
            `}
          >
            {selectedRows.size > 0 && (
              <div className={`w-2 h-2 bg-white rounded-sm ${selectedRows.size === tableData.length ? 'hidden' : ''}`} />
            )}
          </button>
        </div>

        <div className="flex items-center px-4 py-3 flex-1">
          <span>Column heading</span>
          <ArrowUpDown size={14} className="ml-2 text-gray-400" />
        </div>
        
        <div className="flex items-center px-4 py-3 w-48">
          <span>Column heading</span>
          <ArrowUpDown size={14} className="ml-2 text-gray-400" />
        </div>
        
        <div className="flex items-center px-4 py-3 w-48">
          <span>Column heading</span>
          <ArrowUpDown size={14} className="ml-2 text-gray-400" />
        </div>
        
        <div className="flex items-center px-4 py-3 w-32">
          <span>Column heading</span>
          <ArrowUpDown size={14} className="ml-2 text-gray-400" />
        </div>
        
        <div className="flex items-center px-4 py-3 w-48">
          <span>Column heading</span>
          <ArrowUpDown size={14} className="ml-2 text-gray-400" />
        </div>
        
        <div className="w-16"></div> {/* Actions column */}
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-100">
        {filteredData.map((item) => (
          <TableRowComponent
            key={item.id}
            id={item.id}
            isSelected={selectedRows.has(item.id)}
            onSelectionChange={handleRowSelection}
            onRowClick={handleRowClick}
            columns={[
              {
                content: <span className="font-semibold">{item.name}</span>,
                type: 'text'
              },
              {
                content: item.description,
                type: 'text'
              },
              {
                content: item.category,
                type: 'text'
              },
              {
                content: null,
                type: 'status',
                status: item.status
              },
              {
                content: item.lastModified,
                type: 'text'
              },
              {
                content: null,
                type: 'action'
              }
            ]}
          />
        ))}
      </div>

      {/* Table Footer */}
      {selectedRows.size > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm border border-blue-300 text-blue-700 rounded hover:bg-blue-100">
                Bulk Edit
              </button>
              <button className="px-3 py-1 text-sm border border-red-300 text-red-700 rounded hover:bg-red-100">
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-gray-400 mb-2">No results found</div>
            <div className="text-sm text-gray-500">
              Try adjusting your search terms
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableContainer;
