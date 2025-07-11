"use client"

import { useState } from "react"
import { MessageSquare, Send, Search, MoreVertical, Paperclip, Smile, Phone, Video } from "lucide-react"

interface ChatMessage {
  id: string
  sender: "me" | "student"
  content: string
  timestamp: string
  type: "text" | "file" | "system"
}

interface Conversation {
  id: string
  studentName: string
  studentAvatar: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isOnline: boolean
  messages: ChatMessage[]
}

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<string>("1")
  const [newMessage, setNewMessage] = useState("")

  const conversations: Conversation[] = [
    {
      id: "1",
      studentName: "Sachith Dhanushka",
      studentAvatar: "SD",
      lastMessage: "Thank you for the detailed explanation about ML algorithms!",
      timestamp: "2 min ago",
      unreadCount: 2,
      isOnline: true,
      messages: [
        {
          id: "1",
          sender: "student",
          content: "Hi Mr. Fernando! I have a question about the assignment you gave me.",
          timestamp: "10:30 AM",
          type: "text",
        },
        {
          id: "2",
          sender: "me",
          content: "Hello Sachith! I'd be happy to help. What specific part are you struggling with?",
          timestamp: "10:32 AM",
          type: "text",
        },
        {
          id: "3",
          sender: "student",
          content:
            "I'm having trouble understanding the difference between supervised and unsupervised learning algorithms.",
          timestamp: "10:35 AM",
          type: "text",
        },
        {
          id: "4",
          sender: "me",
          content:
            "Great question! Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data. Let me give you some examples...",
          timestamp: "10:37 AM",
          type: "text",
        },
        {
          id: "5",
          sender: "student",
          content: "Thank you for the detailed explanation about ML algorithms!",
          timestamp: "10:45 AM",
          type: "text",
        },
        {
          id: "6",
          sender: "student",
          content: "Thank you for the detailed explanation about ML algorithms!",
          timestamp: "10:45 AM",
          type: "text",
        },
        {
          id: "7",
          sender: "me",
          content:
            "Great question! Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data. Let me give you some examples...",
          timestamp: "10:37 AM",
          type: "text",
        },
        {
          id: "9",
          sender: "student",
          content:
            "Great question! Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data. Let me give you some examples...",
          timestamp: "10:37 AM",
          type: "text",
        },
      ],
    },
    {
      id: "2",
      studentName: "Eraji Madusanka",
      studentAvatar: "EM",
      lastMessage: "Can we schedule a video call for tomorrow?",
      timestamp: "1 hour ago",
      unreadCount: 1,
      isOnline: false,
      messages: [
        {
          id: "1",
          sender: "student",
          content: "Hi! I've completed the data structures assignment.",
          timestamp: "9:15 AM",
          type: "text",
        },
        {
          id: "2",
          sender: "me",
          content: "Excellent! I'll review it and provide feedback by tomorrow.",
          timestamp: "9:20 AM",
          type: "text",
        },
        {
          id: "3",
          sender: "student",
          content: "Can we schedule a video call for tomorrow?",
          timestamp: "9:25 AM",
          type: "text",
        },
      ],
    },
    {
      id: "3",
      studentName: "Dinuka Sahan",
      studentAvatar: "DS",
      lastMessage: "The project is coming along well, thanks to your guidance!",
      timestamp: "3 hours ago",
      unreadCount: 0,
      isOnline: true,
      messages: [
        {
          id: "1",
          sender: "student",
          content: "I've made progress on the web development project.",
          timestamp: "8:00 AM",
          type: "text",
        },
        {
          id: "2",
          sender: "me",
          content: "That's great to hear! What features have you implemented so far?",
          timestamp: "8:05 AM",
          type: "text",
        },
        {
          id: "3",
          sender: "student",
          content: "The project is coming along well, thanks to your guidance!",
          timestamp: "8:30 AM",
          type: "text",
        },
      ],
    },
    {
      id: "4",
      studentName: "Isuru Naveen",
      studentAvatar: "IS",
      lastMessage: "Thank you for the career advice",
      timestamp: "1 day ago",
      unreadCount: 0,
      isOnline: false,
      messages: [
        {
          id: "1",
          sender: "student",
          content: "I wanted to ask about career paths in data science.",
          timestamp: "Yesterday 3:00 PM",
          type: "text",
        },
        {
          id: "2",
          sender: "me",
          content:
            "Data science offers many exciting paths. What interests you most - research, industry applications, or consulting?",
          timestamp: "Yesterday 3:05 PM",
          type: "text",
        },
        {
          id: "3",
          sender: "student",
          content: "Thank you for the career advice",
          timestamp: "Yesterday 3:30 PM",
          type: "text",
        },
        {
          id: "4",
          sender: "student",
          content: "Thank you for the career advice",
          timestamp: "Yesterday 3:30 PM",
          type: "text",
        },
        {
          id: "5",
          sender: "student",
          content: "Thank you for the career advice",
          timestamp: "Yesterday 3:30 PM",
          type: "text",
        },
      ],
    },
    {
      id: "5",
      studentName: "Saranga Thalagalage",
      studentAvatar: "ST",
      lastMessage: "Looking forward to our session tomorrow",
      timestamp: "2 days ago",
      unreadCount: 0,
      isOnline: true,
      messages: [
        {
          id: "1",
          sender: "student",
          content: "Hi! I've prepared some questions for our next session.",
          timestamp: "2 days ago 2:00 PM",
          type: "text",
        },
        {
          id: "2",
          sender: "me",
          content: "Perfect! I'm excited to see what you've been working on.",
          timestamp: "2 days ago 2:15 PM",
          type: "text",
        },
        {
          id: "3",
          sender: "student",
          content: "Looking forward to our session tomorrow",
          timestamp: "2 days ago 2:20 PM",
          type: "text",
        },
      ],
    },
  ]

  const currentConversation = conversations.find((conv) => conv.id === selectedConversation)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  return (
    <>
    <div className="flex-1 bg-gray-50 h-[calc(100vh-4rem)] overflow-hidden">
      <div className="mx-auto h-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 h-full overflow-hidden">
          {/* Conversations List */}
          <div className="lg:col-span-1 h-full overflow-hidden">
            <div className="bg-white shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                  <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {conversations.filter((c) => c.unreadCount > 0).length}
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="space-y-1 p-4">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation === conversation.id
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="relative">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{conversation.studentAvatar}</span>
                        </div>
                        {conversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">{conversation.studentName}</p>
                          <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3 h-full overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">
              {currentConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {currentConversation.studentAvatar}
                            </span>
                          </div>
                          {currentConversation.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{currentConversation.studentName}</h3>
                          <p className="text-sm text-gray-500">
                            {currentConversation.isOnline ? "Online" : "Last seen 2 hours ago"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                          <Phone className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                          <Video className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto min-h-0">
                    <div className="space-y-4">
                      {currentConversation.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender === "me" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${message.sender === "me" ? "text-blue-100" : "text-gray-500"}`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-gray-200 p-4 flex-shrink-0">
                    <div className="flex items-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                        <Paperclip className="h-4 w-4" />
                      </button>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                        />
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                        <Smile className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center overflow-hidden">
                  <div className="text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Select a conversation</h3>
                    <p className="text-gray-500">Choose a conversation from the list to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
