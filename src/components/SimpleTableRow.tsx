'use client';

import React, { useState } from 'react';
import { Check, Circle, MoreHorizontal } from 'lucide-react';

interface SimpleTableRowProps {
  id: string | number;
  isSelected?: boolean;
  onToggleSelect?: (id: string | number) => void;
  children: React.ReactNode;
  onClick?: (id: string | number) => void;
  className?: string;
  showActions?: boolean;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onDuplicate?: (id: string | number) => void;
}

const SimpleTableRow: React.FC<SimpleTableRowProps> = ({
  id,
  isSelected = false,
  onToggleSelect,
  children,
  onClick,
  className = '',
  showActions = true,
  onEdit,
  onDelete,
  onDuplicate
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSelect) {
      onToggleSelect(id);
    }
  };

  const handleRowClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    setShowMenu(false);
    action();
  };

  return (
    <div
      className={`
        flex items-center w-full border-b border-gray-100 hover:bg-gray-50 
        transition-colors duration-150 cursor-pointer group relative
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

      {/* Content */}
      <div className="flex-1 py-3">
        {children}
      </div>

      {/* Actions Menu */}
      {showActions && (
        <div className="flex items-center justify-center w-12 h-12 shrink-0 relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className={`
              p-1 rounded hover:bg-gray-200 transition-colors
              ${isHovered || showMenu ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <MoreHorizontal size={16} className="text-gray-400" />
          </button>
          
          {showMenu && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              
              {/* Menu */}
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-[120px]">
                <div className="py-1">
                  {onEdit && (
                    <button 
                      onClick={(e) => handleActionClick(e, () => onEdit(id))}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      Edit
                    </button>
                  )}
                  {onDuplicate && (
                    <button 
                      onClick={(e) => handleActionClick(e, () => onDuplicate(id))}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      Duplicate
                    </button>
                  )}
                  {onDelete && (
                    <button 
                      onClick={(e) => handleActionClick(e, () => onDelete(id))}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SimpleTableRow;
