"use client"

import { useState } from "react"
import { DropdownMenu, type DropdownMenuItem } from "@/components/chat/dropdownMenu"
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  User,
  Settings,
  Archive,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/chat/button"
import { Input } from "@/components/chat/input"
import Image from "next/image"

import contacts from "@/data/chat/contacts"
import messages from "@/data/chat/messages"

import Contact from "@/types/contact";





export default function ChatUI() {
  const [selectedContact, setSelectedContact] = useState<Contact>(contacts[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message logic here
      setNewMessage("")
    }
  }

  // Define dropdown menu items
  const dropdownItems: DropdownMenuItem[] = [
    {
      label: "View Profile",
      icon: <User className="w-4 h-4 text-value1" />,
      onClick: () => console.log("View profile for:", selectedContact.name),
    },
    {
      label: "Chat Settings",
      icon: <Settings className="w-4 h-4 text-value1" />,
      onClick: () => console.log("Open chat settings"),
    },
    {
      type: "separator",
      label: "", // Required but not used for separator
    },
    {
      label: "Archive Chat",
      icon: <Archive className="w-4 h-4 text-value1" />,
      onClick: () => console.log("Archive chat with:", selectedContact.name),
    },
    {
      label: "Delete Chat",
      icon: <Trash2 className="w-4 h-4 text-danger" />,
      onClick: () => console.log("Delete chat with:", selectedContact.name),
      className: "text-danger hover:bg-red-50",
    },
  ]

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r border-value2 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-value2">
          <h1 className="text-xl font-semibold text-primary mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-value1 w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-value2 focus:border-secondary focus:ring-secondary"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`p-4 cursor-pointer transition-colors hover:bg-white/50 ${
                selectedContact.id === contact.id ? "bg-white border-r-2 border-primary" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                {/* TODO: change default image */}
                  <Image className="rounded-4xl" src={'/image/user.jpg'} alt="user" width={32} height={32}></Image>
                  {contact.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-primary truncate">{contact.name}</h3>
                    <span className="text-xs text-value1">{contact.time}</span>
                  </div>
                  <p className="text-sm text-value1 truncate mt-1">{contact.lastMessage}</p>
                </div>
                {contact.unread && (
                  <div className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {contact.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-value2 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                {/* TODO: change default image */}
                <Image className="rounded-4xl" src={'/image/user.jpg'} alt="user" width={32} height={32}></Image>
                {selectedContact.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-primary">{selectedContact.name}</h2>
                <p className="text-sm text-value1">{selectedContact.online ? "Online" : "Last seen recently"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-value1 hover:text-primary hover:bg-value3">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-value1 hover:text-primary hover:bg-value3">
                <Video className="w-4 h-4" />
              </Button>
              <DropdownMenu
                trigger={
                  <Button variant="ghost" size="sm" className="text-value1 hover:text-primary hover:bg-value3">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                }
                items={dropdownItems}
                align="right"
              />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-value3/30 to-white">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-white text-gray-800 border border-value2 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div
                    className={`flex items-center justify-end mt-1 space-x-1 ${
                      message.sender === "user" ? "text-value3" : "text-value1"
                    }`}
                  >
                    <span className="text-xs">{message.time}</span>
                    {message.sender === "user" && message.status && (
                      <div className="flex">
                        <div
                          className={`w-1 h-1 rounded-full ${message.status === "read" ? "bg-value3" : "bg-value2"}`}
                        ></div>
                        <div
                          className={`w-1 h-1 rounded-full ml-0.5 ${
                            message.status === "read" ? "bg-value3" : "bg-value2"
                          }`}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-value2 bg-white">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-value1 hover:text-primary hover:bg-value3">
              <Paperclip className="w-4 h-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="pr-10 border-value2 focus:border-secondary focus:ring-secondary"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-value1 hover:text-primary"
              >
                <Smile className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
