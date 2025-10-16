"use client";

import React from 'react';
import { useNotifications, NotificationItem } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPanel({
  userId,
  token,
  onClose,
}: {
  userId?: string | null;
  token?: string | null;
  onClose?: () => void;
}) {
  const { notifications, markAsRead, refresh, connected } = useNotifications(userId || null, token || null);

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Notifications {connected ? <span className="text-green-500">●</span> : <span className="text-gray-400">●</span>}</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => refresh()} className="text-sm text-blue-600">Refresh</button>
          <button onClick={() => onClose?.()} className="text-sm text-gray-600">Close</button>
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-auto">
        {notifications.length === 0 && <div className="text-sm text-gray-500">No notifications</div>}
        {notifications.map((n: NotificationItem) => (
          <div key={n.id} className={`p-2 border rounded ${n.isRead ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{n.title}</div>
                {n.body && <div className="text-sm text-gray-600">{n.body}</div>}
                <div className="text-xs text-gray-400 mt-1">{n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : ''}</div>
              </div>
              <div className="ml-2 flex flex-col items-end">
                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="text-xs text-blue-600"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
