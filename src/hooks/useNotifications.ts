"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { connect, disconnect } from '@/utils/socket';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

type NotificationItem = {
  id: string;
  title: string;
  body?: string;
  type?: string;
  data?: any;
  isRead?: boolean;
  createdAt?: string;
};

export function useNotifications(userId?: string | null, token?: string | null) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const mountedRef = useRef(false);

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        console.error('Failed to fetch notifications', res.statusText);
        return;
      }
      const data: NotificationItem[] = await res.json();
      if (!mountedRef.current) return;
      setNotifications(data.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')));
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (e) {
      console.error('Error fetching notifications', e);
    }
  }, [token]);

  const handleIncoming = useCallback((payload: NotificationItem) => {
    // Merge or add
    setNotifications((prev) => {
      const idx = prev.findIndex((p) => p.id === payload.id);
      let next: NotificationItem[];
      if (idx === -1) {
        next = [payload, ...prev];
      } else {
        next = [...prev];
        next[idx] = { ...next[idx], ...payload };
      }
      return next.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    });
    setUnreadCount((prev) => prev + (payload.isRead ? 0 : 1));
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Fetch initial list when token present
    if (!token) return;
    refresh();
  }, [token, refresh]);

  useEffect(() => {
    // Only run in browser and when we have both userId and token
    if (typeof window === 'undefined') return;
    if (!token || !userId) return;

    setConnected(false);

    connect(token, userId, (payload) => {
      handleIncoming(payload);
    }, () => {
      setConnected(true);
    }, () => {
      setConnected(false);
    });

    return () => {
      disconnect();
    };
  }, [token, userId, handleIncoming]);

  const markAsRead = useCallback(
    async (id: string) => {
      if (!token) return;
      // Optimistic update: mark locally then send request
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      try {
        const res = await fetch(`${API_URL}/api/v1/notifications/${id}/read`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          console.error('Failed to mark notification as read', res.statusText);
          // rollback
          setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)));
          setUnreadCount((prev) => prev + 1);
          return;
        }
        const updated: NotificationItem = await res.json();
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
      } catch (e) {
        console.error('Error marking notification read', e);
        // rollback
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)));
        setUnreadCount((prev) => prev + 1);
      }
    },
    [token]
  );

  // Respond to a project request notification
  const respondToProjectRequest = useCallback(
    async (notification: NotificationItem, decision: 'ACCEPTED' | 'REJECTED') => {
      if (!token || !notification?.id) return;

      const id = notification.id;
      const actionUrl = notification?.data?.actionUrl || `${API_URL}/api/v1/notifications/${id}/respond`;
      const method: 'POST' | 'PUT' = (notification?.data?.method === 'PUT' ? 'PUT' : 'POST');
      const body: any = { status: decision };
      if (notification?.data?.requestId) body.requestId = notification.data.requestId;

      // Optimistic UI: mark as read and set local status
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, isRead: true, data: { ...(n.data || {}), status: decision } }
            : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - (notification.isRead ? 0 : 1)));

      try {
        const res = await fetch(actionUrl, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          console.error('Failed to respond to project request', res.status, res.statusText);
          // rollback
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === id ? { ...n, isRead: notification.isRead ?? false, data: { ...(notification.data || {}) } } : n
            )
          );
          setUnreadCount((prev) => prev + (notification.isRead ? 0 : 1));
          return;
        }

        // If API returns updated notification, merge it; otherwise keep optimistic
        try {
          const updated: NotificationItem = await res.json();
          if (updated && updated.id) {
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
          }
        } catch (_) {
          // no body
        }
      } catch (e) {
        console.error('Error responding to project request', e);
        // rollback
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, isRead: notification.isRead ?? false, data: { ...(notification.data || {}) } } : n
          )
        );
        setUnreadCount((prev) => prev + (notification.isRead ? 0 : 1));
      }
    },
    [token]
  );

  return {
    notifications,
    unreadCount,
    markAsRead,
    refresh,
    connected,
    respondToProjectRequest,
  } as const;
}

export type { NotificationItem };
