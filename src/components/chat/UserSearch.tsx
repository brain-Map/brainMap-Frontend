// components/UserSearch.tsx
'use client';

import { useState, useEffect } from 'react';
import { UserSearchResult } from '@/lib/websocket';

interface UserSearchProps {
  token: string;
  onUserSelect: (user: UserSearchResult | null) => void;
  selectedUser: UserSearchResult | null;
}

export default function UserSearch({ token, onUserSelect, selectedUser }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<UserSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    console.log("tokeeeeeeeen: ", token);
    
    const searchUsers = async () => {
      if (searchQuery.trim().length < 1) {
        setSearchResult(null);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/search?id=${encodeURIComponent(searchQuery)}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          const user = await response.json();
          console.log("assssssssssssss", user);
          
          setSearchResult(user);
        } else {
          setSearchResult(null);
        }
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchResult(null);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, token]);

  return (
    <div className="border-b border-gray-300 p-4 bg-gray-50">
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Send private message to:
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users by User ID..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {selectedUser && (
        <div className="mb-2">
          <div className="flex items-center justify-between bg-blue-100 px-3 py-2 rounded-lg">
            <span className="text-sm font-medium text-blue-800">
              Chatting with: {selectedUser.id}
            </span>
            <button
              onClick={() => onUserSelect(null)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {isSearching && searchQuery.length >= 1 && (
        <div className="text-sm text-gray-500">Searching...</div>
      )}

      {searchResult && !selectedUser && (
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => {
              // Map the API response to match UserSearchResult interface
              const mappedUser = {
                id: searchResult.id,
                email: searchResult.email,
                firstName: searchResult.firstName,
                lastName: searchResult.lastName,
                username: searchResult.username
              };
              onUserSelect(mappedUser);
              setSearchQuery('');
              setSearchResult(null);
            }}
            className="w-full text-left px-3 py-2 hover:bg-gray-100"
          >
            <div className="text-sm font-medium text-gray-900">{searchResult.username}</div>
            {searchResult.email && (
              <div className="text-xs text-gray-500">{searchResult.email}</div>
            )}
          </button>
        </div>
      )}
    </div>
  );
}