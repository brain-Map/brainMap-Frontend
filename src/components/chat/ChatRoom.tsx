// components/ChatRoom.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { WebSocketService, ChatMessage, UserSearchResult } from '@/lib/websocket';
import UserSearch from './UserSearch';

interface ChatRoomProps {
  token: string;
  username: string;
  userId: string;
}

export default function ChatRoom({ token, username, userId }: ChatRoomProps) {
  const [publicMessages, setPublicMessages] = useState<ChatMessage[]>([]);
  const [privateMessages, setPrivateMessages] = useState<ChatMessage[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [activeTab, setActiveTab] = useState<'public' | 'private'>('public');
  const [currentUserId, setCurrentUserId] = useState('');
  
  const wsService = useRef<WebSocketService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    console.log("SELECTED: ", selectedUser);
    
  }, [selectedUser])
  useEffect(() => {
    scrollToBottom();
  }, [publicMessages, privateMessages, activeTab]);

  useEffect(() => {
    connectToChat();

    return () => {
      if (wsService.current) {
        wsService.current.disconnect();
      }
    };
  }, []);

  const connectToChat = async () => {
    if (connecting) return;

    setConnecting(true);
    wsService.current = new WebSocketService(token, userId);

    try {
      await wsService.current.connect(
        (message) => {
          console.log('📩 Public message received:', message);
          setPublicMessages(prev => [...prev, message]);
        },
        (message) => {
          console.log('🔒 Private message received:', message);
          setPrivateMessages(prev => [...prev, message]);
        },
        (userId) => {
          console.log('✅ Connected with user ID:', userId);
          setCurrentUserId(userId);
          setConnected(true);
          setConnecting(false);
          wsService.current?.addUser(username);
        }
      );
    } catch (error) {
      console.error('Failed to connect:', error);
      setConnecting(false);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim() || !wsService.current?.isConnected()) return;

    if (selectedUser && activeTab === 'private') {
      console.log('🚀 Sending private message:', {
        content: messageContent.trim(),
        from: username,
        fromId: currentUserId,
        to: selectedUser.email,
        toId: selectedUser.id
      });
      
      const receiverId = selectedUser.id;
      wsService.current.sendPrivateMessage(
        messageContent.trim(),
        username,
        receiverId,
        selectedUser.email
      );
    } else {
      console.log('🚀 Sending public message:', messageContent.trim());
      wsService.current.sendPublicMessage(messageContent.trim(), username);
    }
    
    setMessageContent('');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRelevantPrivateMessages = () => {
    if (!selectedUser) return [];
    
    console.log('Private messages:', privateMessages);
    console.log('Selected user ID:', selectedUser.id);
    console.log('Current user ID:', currentUserId);
    
    // Try both id and userId properties to handle inconsistencies
    const selectedUserId = selectedUser.id;
    
    return privateMessages.filter(msg => {
      const isToSelectedUser = msg.senderId === currentUserId && msg.receiverId === selectedUserId;
      const isFromSelectedUser = msg.senderId === selectedUserId && msg.receiverId === currentUserId;
      
      console.log(`Message ${msg.content}: senderId=${msg.senderId}, receiverId=${msg.receiverId}, matches=${isToSelectedUser || isFromSelectedUser}`);
      
      return isToSelectedUser || isFromSelectedUser;
    });
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const isOwnMessage = message.senderId === currentUserId;
    
    if (message.type !== 'CHAT') {
      return (
        <div key={index} className="text-sm text-center py-2">
          <span className="bg-gray-200 px-3 py-1 rounded-full">
            {message.sender} {message.type === 'JOIN' ? 'joined' : 'left'} the chat
          </span>
        </div>
      );
    }

    return (
      <div key={index} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwnMessage
            ? 'bg-blue-500 text-white'
            : 'bg-white border border-gray-300'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-semibold ${
              isOwnMessage ? 'text-blue-100' : 'text-gray-600'
            }`}>
              {isOwnMessage ? 'You' : message.sender}
            </span>
            <span className={`text-xs ${
              isOwnMessage ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {formatTime(message.timestamp)}
            </span>
          </div>
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    );
  };

  if (connecting) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentMessages = activeTab === 'public' ? publicMessages : getRelevantPrivateMessages();

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-lg">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold">Chat Room</h1>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm">{connected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('public')}
            className={`px-3 py-1 rounded ${
              activeTab === 'public' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Public Chat
          </button>
          <button
            onClick={() => setActiveTab('private')}
            className={`px-3 py-1 rounded ${
              activeTab === 'private' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Private Chat
          </button>
        </div>
      </div>

      {/* User Search - only show for private chat */}
      {activeTab === 'private' && (
        <UserSearch
          token={token}
          onUserSelect={setSelectedUser}
          selectedUser={selectedUser}
        />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {activeTab === 'private' && !selectedUser ? (
          <div className="text-center text-gray-500 mt-8">
            Search and select a user to start a private conversation
          </div>
        ) : (
          currentMessages.map((message, index) => renderMessage(message, index))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-300 p-4 bg-white">
        <form onSubmit={sendMessage} className="flex space-x-3">
          <input
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder={
              activeTab === 'private' && selectedUser
                ? `Send private message to ${selectedUser.email}...`
                : activeTab === 'private'
                ? 'Select a user first...'
                : 'Type your message...'
            }
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!connected || (activeTab === 'private' && !selectedUser)}
          />
          <button
            type="submit"
            disabled={!connected || !messageContent.trim() || (activeTab === 'private' && !selectedUser)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}