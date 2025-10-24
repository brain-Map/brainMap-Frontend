'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className="flex items-center justify-center mt-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => !isFirst && onPageChange(currentPage - 1)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          disabled={isFirst}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded text-sm font-medium ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => !isLast && onPageChange(currentPage + 1)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          disabled={isLast}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
