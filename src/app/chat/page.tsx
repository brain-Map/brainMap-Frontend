'use client';

import { useEffect, useState } from 'react';
import ChatRoom from '@/components/chat/ChatRoom';
import { useAuth } from '@/contexts/AuthContext';

export default function ChatPage() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {user} = useAuth();


  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setToken(accessToken || '')
  })
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setIsLoggedIn(true);
    }
  };

  if (isLoggedIn) {
    return <ChatRoom token={token} username={user?.name || "Eminem"} userId={user?.id || ''} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Join Chat</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
}