'use client';

import React, { useState } from 'react';
import { 
  Check, 
  Circle, 
  MoreHorizontal, 
  ArrowUpDown,
  ChevronDown 
} from 'lucide-react';

interface TableRowProps {
  id: string | number;
  isSelected?: boolean;
  onSelectionChange?: (id: string | number, isSelected: boolean) => void;
  columns: {
    content: React.ReactNode;
    type?: 'text' | 'status' | 'action';
    status?: 'active' | 'inactive';
  }[];
  onRowClick?: (id: string | number) => void;
  className?: string;
}

const TableRowComponent: React.FC<TableRowProps> = ({
  id,
  isSelected = false,
  onSelectionChange,
  columns,
  onRowClick,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectionChange) {
      onSelectionChange(id, !isSelected);
    }
  };

  const handleRowClick = () => {
    if (onRowClick) {
      onRowClick(id);
    }
  };

  return (
    <div
      className={`
        flex items-center w-full border-b border-gray-100 hover:bg-gray-50 
        transition-colors duration-150 cursor-pointer group
        ${isSelected ? 'bg-blue-50 border-blue-200' : ''}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleRowClick}
    >
      {/* Checkbox/Tick Column */}
      <div className="flex items-center justify-center w-12 h-12 shrink-0">
        <button
          onClick={handleCheckboxClick}
          className={`
            flex items-center justify-center w-5 h-5 rounded border-2 
            transition-all duration-200
            ${
              isSelected
                ? 'bg-blue-500 border-blue-500 text-white'
                : 'border-gray-300 hover:border-blue-400 bg-white'
            }
          `}
        >
          {isSelected ? (
            <Check size={12} className="text-white" />
          ) : (
            <Circle 
              size={12} 
              className={`${
                isHovered ? 'text-blue-400' : 'text-transparent'
              } transition-colors duration-200`} 
            />
          )}
        </button>
      </div>

      {/* Dynamic Columns */}
      {columns.map((column, index) => (
        <div
          key={index}
          className={`
            flex items-center px-4 py-3 min-h-[48px]
            ${index === 0 ? 'flex-1' : 'flex-shrink-0'}
            ${column.type === 'action' ? 'w-16' : ''}
          `}
        >
          {column.type === 'status' ? (
            <StatusIndicator status={column.status || 'inactive'} />
          ) : column.type === 'action' ? (
            <ActionMenu />
          ) : (
            <div className="text-sm text-gray-700 font-medium truncate">
              {column.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Status Indicator Component
const StatusIndicator: React.FC<{ status: 'active' | 'inactive' }> = ({ status }) => {
  return (
    <div className="flex items-center space-x-2">
      <div
        className={`
          w-2 h-2 rounded-full
          ${status === 'active' ? 'bg-green-500' : 'bg-gray-400'}
        `}
      />
      <span
        className={`
          text-xs font-medium capitalize
          ${status === 'active' ? 'text-green-600' : 'text-gray-500'}
        `}
      >
        {status}
      </span>
    </div>
  );
};

// Action Menu Component
const ActionMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1 rounded hover:bg-gray-200 transition-colors"
      >
        <MoreHorizontal size={16} className="text-gray-400" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
          <div className="py-1">
            <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50">
              Edit
            </button>
            <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50">
              Duplicate
            </button>
            <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableRowComponent;
