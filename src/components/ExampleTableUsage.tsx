'use client';

import React, { useState } from 'react';
import SimpleTableRow from './SimpleTableRow';

// Example usage of SimpleTableRow component
const ExampleTableUsage: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set());

  // Sample data
  const tableItems = [
    { id: 1, name: 'Bold text column', description: 'Regular text column', status: 'Active' },
    { id: 2, name: 'Bold text column', description: 'Regular text column', status: 'Active' },
    { id: 3, name: 'Bold text column', description: 'Regular text column', status: 'Inactive' },
    { id: 4, name: 'Bold text column', description: 'Regular text column', status: 'Active' },
    { id: 5, name: 'Bold text column', description: 'Regular text column', status: 'Inactive' },
  ];

  const handleToggleSelect = (id: string | number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
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

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Example Table</h3>
      </div>

      {/* Table */}
      <div className="divide-y divide-gray-100">
        {tableItems.map((item) => (
          <SimpleTableRow
            key={item.id}
            id={item.id}
            isSelected={selectedItems.has(item.id)}
            onToggleSelect={handleToggleSelect}
            onClick={handleRowClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          >
            {/* Custom content for each row */}
            <div className="flex items-center justify-between px-4">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-gray-600">{item.description}</div>
                  <div className="text-gray-600">Regular text column</div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        item.status === 'Active' ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="text-gray-600">Regular text column</div>
                </div>
              </div>
            </div>
          </SimpleTableRow>
        ))}
      </div>

      {/* Footer with selection info */}
      {selectedItems.size > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setSelectedItems(new Set())}
                className="px-3 py-1 text-sm border border-blue-300 text-blue-700 rounded hover:bg-blue-100"
              >
                Clear Selection
              </button>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Bulk Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExampleTableUsage;
