"use client";

import React, { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationsPanelView from '@/components/NotificationsPanelView';
import { Bell } from 'lucide-react';

export default function NotificationBadge({ userId, token, compact }: { userId?: string | null; token?: string | null; compact?: boolean }) {
  const { unreadCount, notifications, markAsRead, refresh, connected, respondToProjectRequest } = useNotifications(userId || null, token || null);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((s) => !s)}
        className={`${compact ? 'p-2.5 hover:bg-gray-100 rounded-lg relative transition-all duration-200 group' : 'px-3 py-1 bg-blue-600 text-white rounded'}`}
        aria-label="Notifications"
      >
        {compact ? (
          <>
            <Bell className="w-5 h-5 text-gray-600 group-hover:text-primary" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-3 h-3 text-[10px] font-bold text-white bg-red-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </>
        ) : (
          <>
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50">
          <NotificationsPanelView
            notifications={notifications}
            markAsRead={markAsRead}
            refresh={refresh}
            connected={connected}
            onClose={() => setOpen(false)}
            respondToProjectRequest={respondToProjectRequest}
          />
        </div>
      )}
    </div>
  );
}
