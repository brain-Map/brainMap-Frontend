"use client";

import React from 'react';
import { NotificationItem } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { RefreshCw, X } from 'lucide-react';

export default function NotificationsPanelView({
  notifications,
  markAsRead,
  refresh,
  connected,
  onClose,
}: {
  notifications: NotificationItem[];
  markAsRead: (id: string) => void;
  refresh: () => void;
  connected: boolean;
  onClose?: () => void;
}) {
  return (
  <div className="p-3 w-full max-w-md bg-white rounded-lg shadow-md" style={{ minWidth: 360 }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          <div className="text-sm font-medium">
            {connected ? <span className="text-green-500">●</span> : <span className="text-gray-400">●</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refresh()}
            className="flex items-center text-sm text-blue-600 gap-2 hover:text-blue-700"
            aria-label="Refresh notifications"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onClose?.()}
            className="flex items-center text-sm text-gray-600 gap-2 hover:text-gray-800"
            aria-label="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-auto">
        {notifications.length === 0 && (
          <div className="text-sm text-gray-500">No notifications</div>
        )}

        {notifications.map((n: NotificationItem) => (
          <div
            key={n.id}
            className={`relative flex items-start gap-3 p-3 rounded-lg border transition-colors duration-150 ${n.isRead ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
          >
            {/* Unread accent */}
            {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-blue-500" />}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-gray-900 truncate">{n.title}</div>
                <div className="text-xs text-gray-400 whitespace-nowrap">{n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : ''}</div>
              </div>

              {n.body && <div className="text-sm text-gray-600 mt-1 truncate">{n.body}</div>}
            </div>

            <div className="flex-shrink-0 ml-2 flex flex-col items-end">
              {!n.isRead ? (
                <button onClick={() => markAsRead(n.id)} className="text-xs text-blue-600 hover:text-blue-700">
                  Mark read
                </button>
              ) : (
                <div className="text-xs text-gray-400">Read</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-gray-100">
        <a href="/notifications" className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2">
          Show all notifications
        </a>
      </div>
    </div>
  );
}
