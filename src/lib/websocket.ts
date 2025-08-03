import messages from '@/data/chat/messages';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { json } from 'stream/consumers';

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

export interface UserSearchResult{
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    mobileNo?: string;
}

export class WebSocketService {
  private client: Client | null = null;
  private connected = false;

  constructor(private token: string, private currentUserId: string) {}

  connect(
    onMessageReceived: (message: ChatMessage) => void,
    onPrivateMessageReceived: (message: ChatMessage) => void,
    onConnected: (userId: string) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        connectHeaders: {
          Authorization: `Bearer ${this.token}`
        },
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        onConnect: () => {
          console.log('✅ Connected to WebSocket');
          this.connected = true;
          
          // Subscribe to public messages
          this.client?.subscribe('/topic/public', (message) => {
            console.log('📩 Raw public message received:', message.body);
            const chatMessage: ChatMessage = JSON.parse(message.body);
            onMessageReceived(chatMessage);
          });

          // Subscribe to private messages
          console.log('🔒 Subscribing to private messages for user:', this.currentUserId);
          this.client?.subscribe('/user/queue/messages', (message) => {
            console.log('🔒 Raw private message received:', message.body);
            const chatMessage: ChatMessage = JSON.parse(message.body);
            onPrivateMessageReceived(chatMessage);
          });
          
          onConnected(this.currentUserId);
          resolve();
        },
        onStompError: (frame) => {
          console.error('❌ Broker reported error: ' + frame.headers['message']);
          console.error('❌ Additional details: ' + frame.body);
          reject(new Error(frame.headers['message']));
        },
        onWebSocketError: (error) => {
          console.error('❌ WebSocket error:', error);
          reject(error);
        }
      });

      this.client.activate();
    });
  }

  sendPublicMessage(content: string, sender: string): void {
    if(this.client && this.connected){
        const chatMessage: ChatMessage = {
            type: 'CHAT',
            content,
            sender,
            senderId: this.currentUserId,
            timestamp: new Date().toISOString(),
            isPrivate:false
        };

        this.client.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify(chatMessage)
        });
    }
  }

  sendPrivateMessage(content: string, sender: string, receiverId: string, receiverEmail: string): void {
    if(this.client && this.connected){
      const chatMessage: ChatMessage = {
        type: 'CHAT',
        content,
        sender,
        senderId: this.currentUserId,
        receiver: receiverEmail,
        receiverId,
        timestamp: new Date().toISOString(),
        isPrivate: true
      };

      console.log('🚀 Publishing private message:', chatMessage);
      console.log('🚀 To destination: /app/chat.sendPrivateMessage');

      this.client.publish({
        destination: '/app/chat.sendPrivateMessage',
        body: JSON.stringify(chatMessage)
      });
    } else {
      console.error('❌ Cannot send private message - client not connected');
    }
  }

  addUser(username: string): void {
    if (this.client && this.connected) {
      const chatMessage: ChatMessage = {
        type: 'JOIN',
        content: '',
        sender: username,
        senderId: this.currentUserId,
        timestamp: new Date().toISOString(),
        isPrivate: false
      };
      
      this.client.publish({
        destination: '/app/chat.addUser',
        body: JSON.stringify(chatMessage)
      });
    }
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  getCurrentUserId(): string {
    return this.currentUserId;
  }
}