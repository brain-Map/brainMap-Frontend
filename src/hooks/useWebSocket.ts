import { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface ChatMessage {
  type: 'CHAT' | 'JOIN' | 'LEAVE';
  content: string;
  sender: string;
  senderId: string;
  receiver?: string;
  receiverId?: string;
  timestamp: string;
  isPrivate: boolean;
}

interface UseWebSocketProps {
  token?: string;
  currentUserId: string;
  username: string;
}

export const useWebSocket = ({ token, currentUserId, username }: UseWebSocketProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [privateMessages, setPrivateMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<Client | null>(null);

  const addMessage = useCallback((message: ChatMessage) => {
    if (message.isPrivate) {
      setPrivateMessages(prev => [...prev, message]);
    } else {
      setMessages(prev => [...prev, message]);
    }
  }, []);

  useEffect(() => {
    if (!username || !currentUserId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`),
      connectHeaders: token ? {
        Authorization: `Bearer ${token}`
      } : {},
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      onConnect: () => {
        console.log('Connected to WebSocket');
        setConnected(true);
        setError(null);
        
        // Subscribe to public messages
        client.subscribe('/topic/public', (message) => {
          const chatMessage: ChatMessage = JSON.parse(message.body);
          addMessage(chatMessage);
        });

        // Subscribe to private messages (if authenticated)
        if (token) {
          client.subscribe('/user/queue/messages', (message) => {
            const chatMessage: ChatMessage = JSON.parse(message.body);
            addMessage(chatMessage);
          });
        }

        // Send join message
        const joinMessage: ChatMessage = {
          type: 'JOIN',
          content: '',
          sender: username,
          senderId: currentUserId,
          timestamp: new Date().toISOString(),
          isPrivate: false
        };

        client.publish({
          destination: '/app/chat.addUser',
          body: JSON.stringify(joinMessage)
        });
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        setError(frame.headers['message'] || 'STOMP error occurred');
      },
      onWebSocketError: (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (client.connected) {
        client.deactivate();
      }
    };
  }, [username, currentUserId, token, addMessage]);

  const sendPublicMessage = useCallback((content: string) => {
    if (clientRef.current && connected) {
      const chatMessage: ChatMessage = {
        type: 'CHAT',
        content,
        sender: username,
        senderId: currentUserId,
        timestamp: new Date().toISOString(),
        isPrivate: false
      };

      clientRef.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(chatMessage)
      });
    }
  }, [connected, username, currentUserId]);

  const sendPrivateMessage = useCallback((content: string, receiverId: string, receiverEmail: string) => {
    if (clientRef.current && connected && token) {
      const chatMessage: ChatMessage = {
        type: 'CHAT',
        content,
        sender: username,
        senderId: currentUserId,
        receiver: receiverEmail,
        receiverId,
        timestamp: new Date().toISOString(),
        isPrivate: true
      };

      clientRef.current.publish({
        destination: '/app/chat.sendPrivateMessage',
        body: JSON.stringify(chatMessage)
      });
    }
  }, [connected, username, currentUserId, token]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      setConnected(false);
    }
  }, []);

  return {
    messages,
    privateMessages,
    connected,
    error,
    sendPublicMessage,
    sendPrivateMessage,
    disconnect,
    // Legacy support
    sendMessage: sendPublicMessage
  };
};