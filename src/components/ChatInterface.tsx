"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MoreVertical, Phone, Video, Paperclip, Send, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import React from "react"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:8080/ws"

export default function ChatInterface() {
  const { user } = useAuth()
  const [token, setToken] = useState<string>("")
  const userId = user?.id || ""
  const [chats, setChats] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const stompClient = useRef<Client | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const [lastMessageId, setLastMessageId] = useState<number | null>(null)

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") || ""
    setToken(accessToken)
  }, [])

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      })
    }
  }, [])

  useEffect(() => {
    if (lastMessageId) {
      setTimeout(() => {
        scrollToBottom()
        setTimeout(() => setLastMessageId(null), 500)
      }, 100)
    }
  }, [lastMessageId, scrollToBottom])

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

  const onPrivateMessageReceive = useCallback(
    (message: any) => {
      console.log("Received WebSocket message:", message.body);
      try {
        const payloadData = JSON.parse(message.body)
        if (payloadData.status === "ERROR") {
          setError(payloadData.message || "An error occurred while processing the message.")
          return
        }
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

  useEffect(() => {
    if (!userId || !token) return

    stompClient.current = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      connectHeaders: { Authorization: `Bearer ${token}` },
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (str) => console.log("STOMP Debug:", str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log(`WebSocket connected for user: ${userId}`);
        stompClient.current?.subscribe(
          `/user/${userId}/private`,
          onPrivateMessageReceive,
          { Authorization: `Bearer ${token}` }
        )
        stompClient.current?.publish({
          destination: "/app/private-message",
          body: JSON.stringify({
            senderId: userId,
            receiverId: "",
            message: "",
            status: "JOIN",
          }),
          headers: { Authorization: `Bearer ${token}` },
        })
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers?.message || "Unknown");
        setError("WebSocket error: " + (frame.headers?.message || "Unknown"))
      },
      onWebSocketError: (error) => {
        console.error("WebSocket connection failed:", error);
        setError("WebSocket connection failed.")
      },
      onDisconnect: () => {
        console.warn("WebSocket disconnected. Attempting to reconnect...");
        setError("WebSocket disconnected.")
      },
    })

    stompClient.current.activate()
    return () => {
      console.log("Deactivating WebSocket connection");
      stompClient.current?.deactivate()
    }
  }, [userId, token, onPrivateMessageReceive])

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
        setTimeout(scrollToBottom, 100)
      })
      .catch(() => {
        setError("Failed to load messages.")
        setMessages([])
        setLoading(false)
      })
  }, [selectedChat, userId, token, scrollToBottom])

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

  const handleSelectUser = (searchedUser: any) => {
    const existingChat = chats.find((chat) => chat.id === searchedUser.id)
    
    if (existingChat) {
      setSelectedChat(existingChat)
    } else {
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
    
    setShowSearch(false)
    setSearchQuery("")
    setSearchResults([])
  }

  const handleSend = () => {
    if (!message.trim() || !selectedChat || !stompClient.current?.connected) return
    console.log("Selected to send: ", selectedChat);
    
    const chatMessage = {
      senderId: userId,
      receiverId: selectedChat.id,
      message: message.trim(),
      status: "MESSAGE",
    }

    console.log("Message to send: ", chatMessage);
    
    stompClient.current.publish({
      destination: "/app/private-message",
      body: JSON.stringify(chatMessage),
      headers: { Authorization: `Bearer ${token}` },
    })
    const newMsg = {
      id: Date.now(),
      senderId: userId,
      receiverId: selectedChat.id,
      message: message.trim(),
      avatar: "/image/avatar/default.jpg",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    }
    setMessages((prev) => [
      ...prev,
      newMsg,
    ])
    setLastMessageId(newMsg.id)
    setMessage("")
  }

  return (
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
                  className="pl-10 rounded-full border-gray-200 focus:border-primary focus:ring-primary"
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
          <button className="flex-1 py-3 px-4 text-sm font-medium text-primary border-b-2 border-primary">
            All
          </button>
          <button className="flex-1 py-3 px-4 text-sm font-medium text-gray-500">Personal</button>
          <button className="flex-1 py-3 px-4 text-sm font-medium text-gray-500">Groups</button>
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
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer ${
                  selectedChat?.id === chat.id ? "bg-primary-5" : ""
                }`}
                onClick={() => setSelectedChat(chat)}
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
                  <p className="text-sm text-primary">Online</p>
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
          {messages.map((msg) => (
            <div
              key={msg.id}
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
                    msg.isOwn ? "bg-primary text-white" : "bg-gray-100 text-gray-900"
                  } ${msg.id === lastMessageId ? "scale-105" : "scale-100"}`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <span className="text-xs text-gray-500">{msg.time}</span>
                  {msg.isOwn && <div className="text-primary">✓✓</div>}
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
                className="pr-12 rounded-full border-gray-200 focus:border-primary focus:ring-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
            </div>
            <Button size="icon" className="rounded-full bg-primary hover-bg-primary-90" onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
