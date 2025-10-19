import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  onClose: (id: string) => void;
}

const styleByType: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
  success: {
    bg: 'bg-gradient-to-br from-green-50 to-green-100',
    border: 'border-green-300',
    text: 'text-green-900',
    icon: 'text-green-600',
  },
  error: {
    bg: 'bg-gradient-to-br from-red-50 to-red-100',
    border: 'border-red-300',
    text: 'text-red-900',
    icon: 'text-red-600',
  },
  info: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    border: 'border-blue-300',
    text: 'text-blue-900',
    icon: 'text-blue-600',
  },
  warning: {
    bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
    border: 'border-yellow-300',
    text: 'text-yellow-900',
    icon: 'text-yellow-600',
  },
};

const iconByType: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 flex-shrink-0" />,
  error: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
  info: <Info className="w-5 h-5 flex-shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 flex-shrink-0" />,
};

export default function Toast({ id, message, type = 'info', onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const style = styleByType[type];

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className={`w-full max-w-sm rounded-xl p-4 border-2 shadow-lg shadow-black/10 flex items-center gap-4 pointer-events-auto overflow-hidden transition-all duration-300 transform ${
        isExiting ? 'opacity-0 scale-95 translate-x-6' : 'opacity-100 scale-100 translate-x-0'
      } ${style.bg} ${style.border}`}
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      <div className={`${style.icon} flex-shrink-0`}>{iconByType[type]}</div>

      {/* Message */}
      <div className={`flex-1 text-sm font-medium leading-relaxed ${style.text}`}>{message}</div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className={`${style.icon} hover:opacity-70 transition-opacity p-1 flex-shrink-0`}
        aria-label="Close toast"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
