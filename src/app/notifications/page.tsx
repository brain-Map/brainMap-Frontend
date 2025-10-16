"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications, NotificationItem } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
  const { user, loading } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const userId = user?.id || null;

  const { notifications, markAsRead, refresh, connected } = useNotifications(userId, token);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All notifications</h1>
        <div className="text-sm text-gray-500">{connected ? <span className="text-green-500">●</span> : <span className="text-gray-400">●</span>}</div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 && <div className="text-sm text-gray-500">No notifications</div>}

        {notifications.map((n: NotificationItem) => (
          <div key={n.id} className={`relative p-4 rounded-lg border ${n.isRead ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-lg font-semibold text-gray-900">{n.title}</div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">{n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : ''}</div>
                </div>

                {n.body && <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{n.body}</div>}

                {n.data && (
                  <pre className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600 overflow-auto">{JSON.stringify(n.data, null, 2)}</pre>
                )}
              </div>

              <div className="flex-shrink-0 ml-4 flex flex-col items-end gap-2">
                {!n.isRead ? (
                  <button onClick={() => markAsRead(n.id)} className="text-sm text-blue-600 hover:text-blue-700">Mark read</button>
                ) : (
                  <div className="text-sm text-gray-400">Read</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button onClick={() => refresh()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Refresh</button>
      </div>
    </div>
  );
}
