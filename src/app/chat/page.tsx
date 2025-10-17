"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MoreVertical, Phone, Video, Paperclip, Send, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import useStomp from "@/hooks/useStomp"
import React from "react"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:8080/ws"

export default function ChatInterface() {
  const { user } = useAuth()
  const [token, setToken] = useState<string>("")
  const userId = user?.id || ""
  const [chats, setChats] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [selectedGroup, setSelectedGroup] = useState<any>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("All")
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [groupMembersToAdd, setGroupMembersToAdd] = useState<any[]>([])
  const stompClientRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const [lastMessageId, setLastMessageId] = useState<number | null>(null)

  // Initialize token safely on client side
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") || ""
    setToken(accessToken)
  }, [])

  // If another page requested opening a chat via localStorage, handle it
  useEffect(() => {
    try {
      const raw = localStorage.getItem('openChatWith')
      if (!raw) return
      const payload = JSON.parse(raw)
      // payload should be { id, name }
      if (!payload || !payload.id) return
      const existingChat = chats.find(c => c.id === payload.id)
      if (existingChat) {
        setSelectedChat(existingChat)
      } else {
        const newChat = { id: payload.id, userId: payload.id, name: payload.name || payload.username || payload.id, avatar: '/image/avatar/default.jpg', lastMessage: '', time: '' }
        setChats((prev) => [newChat, ...prev])
        setSelectedChat(newChat)
      }
      localStorage.removeItem('openChatWith')
    } catch (e) {
      // ignore
    }
  }, [chats])

  // Smooth scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      })
    }
  }, [])

  // Auto-scroll when new messages are added
  useEffect(() => {
    if (lastMessageId) {
      setTimeout(() => {
        scrollToBottom()
        // Reset the lastMessageId after animation
        setTimeout(() => setLastMessageId(null), 500)
      }, 100)
    }
  }, [lastMessageId, scrollToBottom])

  // Fetch chats from API
  useEffect(() => {
    if (!userId || !token) return
    setLoading(true)
    setError(null)
    fetch(`${API_URL}/api/v1/messages/chats/${userId}/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => {
        const apiChats = data.map((c: any) => ({
          id: c.id,
          userId: c.userId,
          name: c.name,
          avatar: c.avatar || "/image/avatar/default.jpg",
          lastMessage: c.lastMessage || "",
          time: c.time || "",
        }))
        setChats(apiChats)
        setSelectedChat(apiChats[0] || null)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load chats.")
        setChats([])
        setSelectedChat(null)
        setLoading(false)
      })
  }, [userId, token])

  // Fetch groups for user
  useEffect(() => {
    if (!userId || !token) return
    fetch(`${API_URL}/api/v1/messages/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        const mapped = Array.isArray(data) ? data : []
        // map to group shape
        const apiGroups = mapped.map((g: any) => ({
          id: g.id || g.groupId || g.groupId,
          name: g.name || g.groupName || `Group ${g.id}`,
          avatar: g.avatar || "/image/avatar/default.jpg",
          lastMessage: g.lastMessage || "",
          time: g.time || "",
        }))
        setGroups(apiGroups)
      })
      .catch(() => {
        setGroups([])
      })
  }, [userId, token])

  // Handle incoming WebSocket messages
  const onPrivateMessageReceive = useCallback(
    (message: any) => {
      console.log("Received WebSocket message:", message?.body || message);
      try {
        const payloadData = typeof message?.body === 'string' ? JSON.parse(message.body) : (message || {})
        if (payloadData.status === "ERROR") {
          setError(payloadData.message || "An error occurred while processing the message.")
          return
        }
        // Only add message if it's for the selected chat
        if (
          selectedChat &&
          ((payloadData.senderId === selectedChat.id && payloadData.receiverId === userId) ||
            (payloadData.senderId === userId && payloadData.receiverId === selectedChat.id))
        ) {
          const newMessage = {
            id: payloadData.id || Date.now(),
            senderId: payloadData.senderId,
            receiverId: payloadData.receiverId,
            message: payloadData.message,
            avatar: payloadData.avatar || "/image/avatar/default.jpg",
            time: payloadData.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isOwn: payloadData.senderId === userId,
          };
          setMessages((prev) => [...prev, newMessage])
          setLastMessageId(newMessage.id)
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.id === selectedChat.id
                ? { ...chat, lastMessage: payloadData.message, time: newMessage.time }
                : chat
            )
          );
        }
      } catch (error) {
        setError("Failed to process incoming message.")
      }
    },
    [selectedChat, userId]
  )

  // WebSocket connect/disconnect
  // Use reusable STMOP hook
  const { connect, disconnect, subscribe, unsubscribe, publish, client } = useStomp({
    token,
    userId,
    onError: (e) => setError(typeof e === 'string' ? e : JSON.stringify(e)),
  })

  // keep reference for imperative checks elsewhere in this component
  useEffect(() => {
    stompClientRef.current = client
  }, [client])

  // subscribe to private messages when connected
  useEffect(() => {
    if (!userId || !token) return
    // subscribe under /user/{userId}/private to match backend
    const destination = `/user/${userId}/private`
    const sub = subscribe(destination, (msg: any) => onPrivateMessageReceive(msg), { Authorization: `Bearer ${token}` })

    // send JOIN presence
    publish?.("/app/private-message", { senderId: userId, receiverId: "", message: "", status: "JOIN" }, { Authorization: `Bearer ${token}` })

    return () => {
      if (sub && typeof sub.unsubscribe === 'function') {
        try { sub.unsubscribe() } catch (e) {}
      } else {
        unsubscribe(destination)
      }
    }
  }, [userId, token, subscribe, unsubscribe, publish, onPrivateMessageReceive])

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChat || !userId) return
    setLoading(true)
    setError(null)
    fetch(`${API_URL}/api/v1/messages/chats/${userId}/${selectedChat.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => {
        console.log("Fetched messages: ", data);
        
        const apiMessages = data.map((m: any) => ({
          id: m.id,
          senderId: m.senderId,
          receiverId: m.receiverId,
          message: m.message,
          avatar: m.avatar || "/image/avatar/default.jpg",
          time: m.time || "",
          isOwn: m.senderId === userId,
        }))
        setMessages(apiMessages)
        setLoading(false)
        // Scroll to bottom after loading messages
        setTimeout(scrollToBottom, 100)
      })
      .catch(() => {
        setError("Failed to load messages.")
        setMessages([])
        setLoading(false)
      })
  }, [selectedChat, userId, token, scrollToBottom])

  // Search users
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        setSearchLoading(false)
        return
      }
      setSearchLoading(true)
      fetch(`${API_URL}/api/v1/users/chat/search?query=${encodeURIComponent(searchQuery.trim())}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.ok ? res.json() : Promise.reject(res))
        .then((data) => {
          const users = Array.isArray(data) ? data : [data]
          
          const mappedResults = users
          .filter((u: any) => u.userId !== userId)
          .map((u: any) => ({
            id: u.userId,
            name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
            username: u.username || "",
            avatar: u.avatarUrl || "/image/avatar/default.jpg",
          }))
          setSearchResults(mappedResults)
          setSearchLoading(false)
        })
        .catch(() => {
          setSearchResults([])
          setSearchLoading(false)
        })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, token, userId])

  // Handle user selection from search
  const handleSelectUser = (searchedUser: any) => {
    // Check if chat already exists
    const existingChat = chats.find((chat) => chat.id === searchedUser.id)
    
    if (existingChat) {
      setSelectedChat(existingChat)
    } else {
      // Create new chat entry
      const newChat = {
        id: searchedUser.id,
        userId: searchedUser.id,
        name: searchedUser.name || searchedUser.username,
        avatar: searchedUser.avatar || "/image/avatar/default.jpg",
        lastMessage: "",
        time: "",
      }
      setChats((prev) => [newChat, ...prev])
      setSelectedChat(newChat)
    }
    
    // Close search
    setShowSearch(false)
    setSearchQuery("")
    setSearchResults([])
  }

  // Group subscription ref so we can unsubscribe when switching
  const groupSubscriptionRef = useRef<any>(null)

  // Fetch messages for group
  const fetchGroupMessages = (groupId: string) => {
    if (!groupId || !token) return
    setLoading(true)
    setError(null)
    fetch(`${API_URL}/api/v1/messages/groups/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        const list = Array.isArray(data) ? data : data.messages || []
        const apiMessages = list.map((m: any) => ({
          id: m.id,
          senderId: m.senderId,
          receiverId: m.receiverId,
          message: m.message,
          avatar: m.avatar || "/image/avatar/default.jpg",
          time: m.time || "",
          isOwn: m.senderId === userId,
        }))
        setMessages(apiMessages)
        setLoading(false)
        setTimeout(scrollToBottom, 100)
      })
      .catch(() => {
        setError("Failed to load group messages.")
        setMessages([])
        setLoading(false)
      })
  }

  const subscribeToGroup = (groupId: string) => {
    if (!client.current?.connected || !groupId) return
    try {
      groupSubscriptionRef.current?.unsubscribe?.()
      const dest = `/group/${groupId}/messages`
      const sub = subscribe(dest, (msg: any) => {
        try {
          const payload = typeof msg.body === 'string' ? JSON.parse(msg.body) : (msg || {})
          const newMessage = {
            id: payload.id || Date.now(),
            senderId: payload.senderId,
            receiverId: payload.receiverId,
            message: payload.message,
            avatar: payload.avatar || "/image/avatar/default.jpg",
            time: payload.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isOwn: payload.senderId === userId,
          }
          setMessages((prev) => [...prev, newMessage])
          setLastMessageId(newMessage.id)
          setGroups((prev) => prev.map((g) => g.id === groupId ? { ...g, lastMessage: payload.message, time: newMessage.time } : g))
        } catch (e) {
          console.error('Failed parsing group message', e)
        }
      }, { Authorization: `Bearer ${token}` })
      groupSubscriptionRef.current = sub
    } catch (e) {
      console.error('Failed to subscribe to group', e)
    }
  }

  const unsubscribeGroup = () => {
    try {
      groupSubscriptionRef.current?.unsubscribe?.()
      groupSubscriptionRef.current = null
    } catch (e) {
      // ignore
    }
  }

  // Create group API call
  const createGroup = () => {
    if (!newGroupName.trim()) return
    const payload: any = { name: newGroupName.trim(), members: groupMembersToAdd.map(m => m.id) }
    console.log(JSON.stringify(payload));
    
    fetch(`${API_URL}/api/v1/messages/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        // refresh groups
        return fetch(`${API_URL}/api/v1/messages/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((groupsData) => {
        const apiGroups = (Array.isArray(groupsData) ? groupsData : []).map((g: any) => ({ id: g.id, name: g.name, avatar: g.avatar || '/image/avatar/default.jpg', lastMessage: g.lastMessage || '', time: g.time || '' }))
        setGroups(apiGroups)
        setShowCreateGroup(false)
        setNewGroupName("")
        setGroupMembersToAdd([])
      })
      .catch(() => {
        setError('Failed to create group')
      })
  }

  // Add user to group
  const addUserToGroup = (groupId: string, userToAddId: string) => {
    fetch(`${API_URL}/api/v1/messages/${groupId}/add-user/${userToAddId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) return Promise.reject(res)
        // Optionally refresh group members or UI
      })
      .catch(() => setError('Failed to add user to group'))
  }

  // Send message via WebSocket (private or group)
  const handleSend = () => {
    if (!message.trim() || !client.current?.connected) return

    // Sending to a group
    if (selectedGroup) {
      const groupMessage = {
        senderId: userId,
        groupId: selectedGroup.id,
        message: message.trim(),
        status: "GROUP_MESSAGE",
      }
      publish?.("/app/group-message", groupMessage, { Authorization: `Bearer ${token}` })
      const newMsg = {
        id: Date.now(),
        senderId: userId,
        groupId: selectedGroup.id,
        message: message.trim(),
        avatar: "/image/avatar/default.jpg",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: true,
      }
      setMessages((prev) => [...prev, newMsg])
      setLastMessageId(newMsg.id)
      // update group's last message
      setGroups((prev) => prev.map((g) => g.id === selectedGroup.id ? { ...g, lastMessage: message.trim(), time: newMsg.time } : g))
      setMessage("")
      return
    }

    // Private message
    if (!selectedChat) return
    const chatMessage = {
      senderId: userId,
      receiverId: selectedChat.id,
      message: message.trim(),
      status: "MESSAGE",
    }
    publish?.("/app/private-message", chatMessage, { Authorization: `Bearer ${token}` })
    const newMsg = {
      id: Date.now(),
      senderId: userId,
      receiverId: selectedChat.id,
      message: message.trim(),
      avatar: "/image/avatar/default.jpg",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    }
    setMessages((prev) => [...prev, newMsg])
    setLastMessageId(newMsg.id)
    setMessage("")
  }

  return (
    <>
    <div className="flex h-[90vh] bg-white mt-[70px]">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* User Profile Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={"/image/avatar/5.jpg"} />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">{user?.name || "User"}</h3>
                <p className="text-sm text-gray-500">Info account</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
            >
              {showSearch ? (
                <X className="h-5 w-5 text-gray-500" />
              ) : (
                <Search className="h-5 w-5 text-gray-500" />
              )}
            </Button>
          </div>

          {/* Search Input */}
          {showSearch && (
            <div className="mt-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-full border-gray-200 focus:border-[#3D52A0] focus:ring-[#3D52A0]"
                />
              </div>

              {/* Search Results */}
              {searchQuery.trim() && (
                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {searchLoading ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {searchResults.map((searchedUser) => (
                        <div
                          key={searchedUser.id}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleSelectUser(searchedUser)}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`${API_URL}/${searchedUser.avatar}` || "/image/avatar/default.jpg"} />
                            <AvatarFallback>{searchedUser.name?.[0] || searchedUser.username?.[0] || "U"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900 truncate">
                              {searchedUser.name || searchedUser.username}
                            </h5>
                            <p className="text-xs text-gray-500 truncate">
                              @{searchedUser.username}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No users found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'All' ? 'text-[#3D52A0] border-b-2 border-[#3D52A0]' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('All'); setSelectedGroup(null); unsubscribeGroup(); }}
          >
            All
          </button>
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'Personal' ? 'text-[#3D52A0] border-b-2 border-[#3D52A0]' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('Personal'); setSelectedGroup(null); unsubscribeGroup(); }}
          >
            Personal
          </button>
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'Groups' ? 'text-[#3D52A0] border-b-2 border-[#3D52A0]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Groups')}
          >
            Groups
          </button>
        </div>

        {/* Messages Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">Messages</h4>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
            {activeTab !== 'Groups' && chats.map((chat) => (
              <div
                key={`chat-${chat.id}`}
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer ${
                  selectedChat?.id === chat.id && !selectedGroup ? "bg-[#3D52A0]/5" : ""
                }`}
                onClick={() => { setSelectedChat(chat); setSelectedGroup(null); unsubscribeGroup(); fetch(`${API_URL}/api/v1/messages/chats/${userId}/${chat.id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : Promise.reject(r)).then(d => { setMessages(d.map((m:any) => ({ id:m.id, senderId:m.senderId, receiverId:m.receiverId, message:m.message, avatar:m.avatar||'/image/avatar/default.jpg', time:m.time, isOwn:m.senderId===userId }))); setTimeout(scrollToBottom,100) }).catch(()=>{}) }}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={chat.avatar || "/image/avatar/default.jpg"} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-gray-900 truncate">{chat.name}</h5>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            ))}

            {activeTab === 'Groups' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium">Your Groups</h5>
                  {/* <Button size="sm" onClick={() => setShowCreateGroup(true)}>Create</Button> */}
                </div>
                {groups.length === 0 ? (
                  <div className="text-sm text-gray-500">No groups yet</div>
                ) : (
                  groups.map((g) => (
                    <div
                      key={`group-${g.id}`}
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer ${selectedGroup?.id === g.id ? 'bg-[#3D52A0]/5' : ''}`}
                      onClick={() => { setSelectedGroup(g); setSelectedChat(null); fetchGroupMessages(g.id); unsubscribeGroup(); subscribeToGroup(g.id); }}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={g.avatar || '/image/avatar/default.jpg'} />
                        <AvatarFallback>{g.name?.[0] || 'G'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-gray-900 truncate">{g.name}</h5>
                          <span className="text-xs text-gray-500">{g.time}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{g.lastMessage}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          {selectedChat && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedChat.avatar || "/image/avatar/default.jpg"} />
                  <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    {selectedChat.name}
                  </h3>
                  <p className="text-sm text-[#3D52A0]">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5 text-gray-500" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5 text-gray-500" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Date Separator */}
        <div className="flex justify-center py-4">
          <span className="bg-gray-100 text-gray-500 text-sm px-3 py-1 rounded-full">Today</span>
        </div>

        {/* Messages */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" 
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.map((msg, idx) => (
            <div
              key={msg.id ?? `message-${idx}`}
              className={`flex gap-3 ${msg.isOwn ? "justify-end" : ""} ${
                msg.id === lastMessageId ? "animate-message-appear" : ""
              } transition-all duration-300 ease-out`}
            >
              {!msg.isOwn && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={msg.avatar || "/image/avatar/default.jpg"} />
                  <AvatarFallback>{msg.senderId?.toString()?.[0] || "U"}</AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-md ${msg.isOwn ? "order-first" : ""}`}>
                <div
                  className={`rounded-2xl p-3 transition-all duration-200 ${
                    msg.isOwn ? "bg-[#3D52A0] text-white" : "bg-gray-100 text-gray-900"
                  } ${msg.id === lastMessageId ? "scale-105" : "scale-100"}`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <span className="text-xs text-gray-500">{msg.time}</span>
                  {msg.isOwn && <div className="text-[#3D52A0]">✓✓</div>}
                </div>
              </div>
              {msg.isOwn && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={msg.avatar || "/image/avatar/default.jpg"} />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5 text-gray-500" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Write a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="pr-12 rounded-full border-gray-200 focus:border-[#3D52A0] focus:ring-[#3D52A0]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
            </div>
            <Button size="icon" className="rounded-full bg-[#3D52A0] hover:bg-[#3D52A0]/90" onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
    {/* Create Group Modal */}
    {/*
    {showCreateGroup && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-medium mb-3">Create Group</h3>
          <Input placeholder="Group name" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className="mb-3" />
          <div className="mb-2">
            <Input placeholder="Search users to add" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="max-h-40 overflow-y-auto mb-4">
            {searchLoading ? (
              <div className="text-sm text-gray-500">Searching...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((u) => (
                <div key={`add-${u.id}`} className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarImage src={`${API_URL}/${u.avatar}`} /><AvatarFallback>{u.name?.[0] || u.username?.[0] || 'U'}</AvatarFallback></Avatar>
                    <div>
                      <div className="text-sm font-medium">{u.name || u.username}</div>
                      <div className="text-xs text-gray-500">@{u.username}</div>
                    </div>
                  </div>
                  <div>
                    <Button size="sm" onClick={() => setGroupMembersToAdd((prev) => prev.find(p=>p.id===u.id) ? prev : [...prev, u])}>Add</Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No users found</div>
            )}
          </div>
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Members to add:</div>
            <div className="flex flex-wrap gap-2">
              {groupMembersToAdd.map((m) => (
                <Badge key={`member-${m.id}`}>{m.name || m.username}</Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => { setShowCreateGroup(false); setNewGroupName(''); setGroupMembersToAdd([]) }}>Cancel</Button>
            <Button onClick={createGroup}>Create</Button>
          </div>
        </div>
      </div>
    )}
      */}
    </>
  )
}
