'use client';
import { useState, useEffect, FormEvent } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

interface User {
  id: string;
  name?: string;
}

const mockUsers: User[] = [
  { id: 'ab0f58a7-2ec1-4d8c-ac0a-e1dc21ea645b', name: 'User2' },
  { id: '4d9c4708-05e6-418f-b0a4-37a62b0d3114', name: 'user1' },
  { id: '3', name: 'Dinuka Sahan' },
  { id: '4', name: 'Isuru Naveen' },
  { id: '5', name: 'Saranga Thalagalage' },
];

export default function DirectChat() {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [receiverId, setReceiverId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Filter out current user from user list
  const otherUsers = mockUsers.filter(u => u.id !== user?.id);

  console.log(user?.name);
  useEffect(() => {
    
    if (!user?.id) return;
    const newSocket = io('http://localhost:8081', { transports: ['websocket'] });
    setSocket(newSocket);

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));

    // Listen for direct messages
    newSocket.on('directMessage', (msg: Message) => {
      // Only show messages relevant to this conversation
      if (
        (msg.senderId === user.id && msg.receiverId === receiverId) ||
        (msg.senderId === receiverId && msg.receiverId === user.id)
      ) {
        setMessages(prev => [...prev, msg]);
      }
    });

    // Optionally, fetch chat history here

    return () => {
      newSocket.disconnect();
    };
  }, [user?.id, receiverId]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket && user?.id && receiverId) {
      const msg: Message = {
        senderId: user.id,
        receiverId,
        content: message,
        timestamp: new Date().toISOString(),
      };
      socket.emit('directMessage', msg);
      setMessages(prev => [...prev, msg]);
      setMessage('');
    }
  };

  if (!user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Please sign in to use chat.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Direct Chat</h1>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Chat with:</label>
          <select
            value={receiverId}
            onChange={e => setReceiverId(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a user</option>
            {otherUsers.map(u => (
              <option key={u.id} value={u.id}>
                {u.name || u.id}
              </option>
            ))}
          </select>
        </div>
        {receiverId && (
          <>
            <div className="mb-4 text-sm text-gray-500">
              Status: {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <div className="h-64 overflow-y-auto mb-4 p-4 bg-gray-50 rounded">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${msg.senderId === user.id ? 'text-right' : 'text-left'}`}
                >
                  <span className="font-bold">
                    {msg.senderId === user.id ? 'Me' : otherUsers.find(u => u.id === msg.senderId)?.name || msg.senderId}:
                  </span>
                  <span> {msg.content}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage}>
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type a message"
                className="w-full p-2 border rounded mb-2"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                disabled={!message.trim()}
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}