"use client";

import { Client, IMessage, Frame } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

type OnMessage = (payload: any) => void;
type OnConnect = (frame: Frame | null) => void;
type OnDisconnect = (evt: CloseEvent | Error | null) => void;

let client: Client | null = null;
let subscription: any = null;
let reconnectAttempts = 0;
let backoffTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Connect to server websocket (SockJS + STOMP) and subscribe to the
 * /user/{userId}/queue/notifications destination.
 *
 */
export function connect(
  token: string,
  userId: string,
  onMessage: OnMessage,
  onConnect?: OnConnect,
  onDisconnect?: OnDisconnect
) {
  if (typeof window === 'undefined') return;
  if (!token || !userId) return;

  // Clean up any previous client
  disconnect();

  reconnectAttempts = 0;
  const envUrl = (process.env.NEXT_PUBLIC_WEBSOCKET_URL as string) || 'http://localhost:8080/ws';
  const useRawWebSocket = envUrl && (envUrl.startsWith('ws://') || envUrl.startsWith('wss://'));

  const clientOptions: any = {
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: (msg: string) => {
    },
    onConnect: (frame: Frame) => {
      reconnectAttempts = 0;
      // Subscribe only to the logged-in user's queue.
      try {
        subscription = client!.subscribe(`/user/${userId}/queue/notifications`, (message: IMessage) => {
          try {
            const body = JSON.parse(message.body);
            onMessage(body);
          } catch (e) {
            console.error('Failed to parse notification message', e);
          }
        });
      } catch (err) {
        console.error('Subscribe error', err);
      }

      onConnect?.(frame || null);
    },
    onStompError: (frame: Frame) => {
      console.error('STOMP error', frame);
    },
    onWebSocketError: (evt: any) => {
      console.warn('WebSocket error', evt);
  console.info('If you see a 404 for /ws/info it means the server does not expose SockJS info endpoint at /ws.\nConsider setting NEXT_PUBLIC_WEBSOCKET_URL to a raw ws:// or wss:// URL served by your STOMP broker.');
    },
    onWebSocketClose: (evt: any) => {
      onDisconnect?.(evt as any);
      scheduleReconnect(token, userId, onMessage, onConnect, onDisconnect);
    },
  };

  if (useRawWebSocket) {
    clientOptions.brokerURL = envUrl;
  } else {
    clientOptions.webSocketFactory = () => new SockJS(envUrl);
  }

  client = new Client(clientOptions as any);
  client.activate();
}

function scheduleReconnect(
  token: string,
  userId: string,
  onMessage: OnMessage,
  onConnect?: OnConnect,
  onDisconnect?: OnDisconnect
) {
  // Exponential backoff with a cap
  reconnectAttempts += 1;
  const delay = Math.min(30000, Math.pow(2, reconnectAttempts) * 1000); // ms

  if (reconnectAttempts >= 4) {
  }

  if (backoffTimer) clearTimeout(backoffTimer);
  backoffTimer = setTimeout(() => {
    try {
      // If client exists, deactivate and create new one through connect
      disconnect();
    } catch (e) {
      // ignore
    }
    connect(token, userId, onMessage, onConnect, onDisconnect);
  }, delay);
}

export function disconnect() {
  if (backoffTimer) {
    clearTimeout(backoffTimer);
    backoffTimer = null;
  }

  if (subscription) {
    try {
      subscription.unsubscribe();
    } catch (e) {
      // ignore
    }
    subscription = null;
  }

  if (client) {
    try {
      client.deactivate();
    } catch (e) {
      // ignore
    }
    client = null;
  }
}