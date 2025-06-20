'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSecondary?: () => void;
  onPrimary?: () => void;
  title?: string;
  message?: string;
  secondaryLabel?: string;
  primaryLabel?: string;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({
  isOpen,
  onClose,
  onSecondary,
  onPrimary,
  title = "You have unsaved data",
  message = "Do you know Material X system contains material design components so stayed as it should look and behave for today",
  secondaryLabel = "Secondary",
  primaryLabel = "Primary Action"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="bg-red-50 px-4 py-3 rounded-t-lg border-b border-red-100 flex items-center justify-between">
          <span className="text-red-700 text-sm font-medium">Error dialog</span>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex items-start space-x-4">
            {/* Warning Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
            
            {/* Text Content */}
            <div className="flex-1">
              <h3 className="text-lg text-left font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-left text-gray-600 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
          <button
            onClick={onSecondary || onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            {secondaryLabel}
          </button>
          <button
            onClick={onPrimary || onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDialog;



{/* <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Error Dialog Component Demo
        </h1>
        
        <button
          onClick={handleOpenDialog}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Show Error Dialog
        </button>

        <ErrorDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onSecondary={handleSecondaryAction}
          onPrimary={handlePrimaryAction}
          title="You have unsaved data"
          message="Do you know Material X system contains material design components so stayed as it should look and behave for today"
          secondaryLabel="Cancel"
          primaryLabel="Delete"
        />
      </div>
    </div> */}