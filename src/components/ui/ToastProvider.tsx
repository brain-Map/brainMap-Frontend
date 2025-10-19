"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Toast from './Toast';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: string;
  message: string;
  type?: ToastType;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType, ttlMs?: number) => string;
  close: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const close = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const show = useCallback((message: string, type: ToastType = 'info', ttlMs = 5000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const item: ToastItem = { id, message, type };
    setToasts(prev => [item, ...prev]);

    if (ttlMs > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, ttlMs);
    }
    return id;
  }, []);

  const value = useMemo(() => ({ show, close }), [show, close]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast container with smooth animations */}
      <div className="fixed top-4 right-4 z-[99999] flex flex-col gap-3 items-end pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className="animate-in slide-in-from-right-full fade-in duration-300"
          >
            <Toast key={t.id} id={t.id} message={t.message} type={t.type} onClose={close} />
          </div>
        ))}
      </div>

      {/* Add custom animation styles */}
      <style>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-in {
          animation: slideInFromRight 0.3s ease-out;
        }

        .slide-in-from-right-full {
          animation: slideInFromRight 0.3s ease-out;
        }

        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
