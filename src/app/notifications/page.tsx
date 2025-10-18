"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications, NotificationItem } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns'; 
import { CheckCircle2, XCircle } from 'lucide-react';
import api from '@/utils/api';

interface approveRequestApi {
  projectId: string;
  status: 'ACCEPTED' | 'PENDING';
}

const ProjectApprove = {
  updateApproval: async (id: string, data: approveRequestApi) => {
    try {
      const response = await api.put(`/api/v1/notifications/projects/${id}/approve`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating project approval:', error);
      throw error;
    }
  },

  getUserProjectData: async (projectId: string, userId: string) => {
    try {
      const response = await api.get(`/api/v1/users/getProjectCollaborator/${projectId}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user project data:', error);
      throw error;
    }
  }

}

export default function NotificationsPage() {
  const { user, loading } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const userId = user?.id || null;


  const { notifications, markAsRead, refresh, connected } = useNotifications(userId, token);

  // Track server-evaluated status for project request notifications
  const [requestStatuses, setRequestStatuses] = React.useState<Record<string, 'ACCEPTED' | 'PENDING' | null>>({});

  const extractProjectId = React.useCallback((n: NotificationItem) => {
    return typeof n.data === 'string'
      ? n.data
      : (n.data?.projectId || n.data?.id || n.data?.projectID || '');
  }, []);

  // On notifications change, check each PROJECT_REQUEST against backend
  React.useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    const run = async () => {
      const entries: Array<Promise<void>> = [];
      notifications
        .filter((n) => n.type === 'PROJECT_REQUEST')
        .forEach((n) => {
          const projectId = extractProjectId(n);
          if (!projectId) return;
          entries.push(
            ProjectApprove.getUserProjectData(projectId, userId)
              .then((res) => {
                // If empty object or array or falsy => PENDING (rejected); if has status ACCEPTED => ACCEPTED; else leave as null (show actions)
                const isEmptyObj = res && typeof res === 'object' && !Array.isArray(res) && Object.keys(res).length === 0;
                const status = !res || isEmptyObj || (Array.isArray(res) && res.length === 0)
                  ? 'PENDING'
                  : (res.status === 'ACCEPTED' ? 'ACCEPTED' : null);
                setRequestStatuses((prev) => ({ ...prev, [n.id]: status }));
              })
              .catch(() => {
                // On error, don't force a status
                setRequestStatuses((prev) => ({ ...prev, [n.id]: null }));
              })
          );
        });
      await Promise.all(entries);
    };
    run();
    return () => controller.abort();
  }, [notifications, userId, extractProjectId]);

  // Custom handler for PROJECT_REQUEST notifications
  const handleProjectRequest = async (n: NotificationItem, status: 'ACCEPTED' | 'PENDING') => {
    const projectId = extractProjectId(n);

    if (!projectId) {
      alert('No projectId found in notification data.');
      return;
    }

    try {
      console.log('User ID:', userId);
      console.log('Notification projectId:', projectId);
      await ProjectApprove.updateApproval(userId || '', { projectId, status });
      // Reflect new status in UI immediately
      setRequestStatuses((prev) => ({ ...prev, [n.id]: status }));
      markAsRead(n.id);
    } catch (e) {
      alert('Failed to update project approval.');
    }
  };

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

                {/* {n.data && (
                  <pre className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600 overflow-auto">{JSON.stringify(n.data, null, 2)}</pre>
                )} */}
              </div>

              <div className="flex-shrink-0 ml-4 flex flex-col items-end gap-2">
                {n.type === 'PROJECT_REQUEST' ? (
                  <div className="flex items-center gap-2">
                    {requestStatuses[n.id] === 'ACCEPTED' ? (
                      <span className="text-green-700 text-sm font-medium">Accepted</span>
                    ) : requestStatuses[n.id] === 'PENDING' ? (
                      <span className="text-red-700 text-sm font-medium">Canceled</span>
                    ) : (
                      <>
                        <button
                          title="Accept request"
                          onClick={() => handleProjectRequest(n, 'ACCEPTED')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button
                          title="Mark pending"
                          onClick={() => handleProjectRequest(n, 'PENDING')}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                ) : !n.isRead ? (
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
