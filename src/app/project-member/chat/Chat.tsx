"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { MessageSquare, Send, MoreVertical, Paperclip } from "lucide-react"

interface ChatMessage {
  id: string
  senderId: string
  content: string
  timestamp: string
  isOwn?: boolean
}

export default function ChatPage() {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const searchParams = useSearchParams()
  const projectId = searchParams?.get("projectId") || ""
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
  const [owners, setOwners] = useState<any[]>([])
  const [collaborators, setCollaborators] = useState<any[]>([])
  const [groupMembers, setGroupMembers] = useState<string[]>([]) // userIds that are currently in the group
  const [pmError, setPmError] = useState<string | null>(null)

  // Try to load token from localStorage for authenticated requests
  const [token, setToken] = useState<string>("")
  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : ""
    setToken(t)
  }, [])

  // current user id to determine owner-only UI; try to read from localStorage
  const [currentUserId, setCurrentUserId] = useState<string>("")
  useEffect(() => {
    const u = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : ""
    setCurrentUserId(u)
  }, [])



  // Fetch project owners and collaborators when projectId is available
  useEffect(() => {
    if (!projectId) return
    setPmError(null)

    // owners
    fetch(`${API_URL}/project-member/projects/owners/${projectId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => setOwners(Array.isArray(data) ? data : []))
      .catch((e) => {
        console.error('Failed to fetch owners', e)
        setOwners([])
        setPmError('Failed to load project owners')
      })

    // collaborators
    fetch(`${API_URL}/project-member/projects/collaborators/${projectId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setCollaborators(list)
        // Initialize groupMembers with collaborators' userIds as a best-effort default
        setGroupMembers(list.map((m: any) => m.userId))
      })
      .catch((e) => {
        console.error('Failed to fetch collaborators', e)
        setCollaborators([])
        setPmError((prev) => prev ? prev + '; Failed to load collaborators' : 'Failed to load collaborators')
      })
  }, [projectId, token])

  // Add user to project chat group. ASSUMPTION: groupId for chat equals projectId. If your API differs, update endpoint accordingly.
  const addUserToGroup = (userId: string) => {
    if (!projectId) return
    fetch(`${API_URL}/api/v1/messages/${projectId}/add-user/${userId}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((r) => {
        if (!r.ok) return Promise.reject(r)
        setGroupMembers((prev) => prev.includes(userId) ? prev : [...prev, userId])
      })
      .catch((e) => {
        console.error('Failed to add user to group', e)
        setPmError('Failed to add user to group')
      })
  }

  const removeUserFromGroup = (userId: string) => {
    if (!projectId) return
    // Some APIs expect POST, some DELETE. Try DELETE first, fallback to POST /remove-user
    fetch(`${API_URL}/api/v1/messages/${projectId}/remove-user/${userId}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((r) => {
        if (!r.ok) return Promise.reject(r)
        setGroupMembers((prev) => prev.filter((id) => id !== userId))
      })
      .catch(() => {
        // fallback
        fetch(`${API_URL}/api/v1/messages/${projectId}/remove-user/${userId}`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
          .then((r) => {
            if (!r.ok) return Promise.reject(r)
            setGroupMembers((prev) => prev.filter((id) => id !== userId))
          })
          .catch((e) => {
            console.error('Failed to remove user from group', e)
            setPmError('Failed to remove user from group')
          })
      })
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto w-full max-w-4xl h-full">
        <div className="h-full bg-white shadow-sm rounded-md overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Project Chat</h2>
              <p className="text-sm text-gray-500">Project: {projectId || 'N/A'}</p>
            </div>
            <div className="flex items-center gap-4">
              {owners.some((o) => o.userId === currentUserId) && (
                <div className="text-sm text-gray-700">You are an owner — you can manage group members</div>
              )}
              <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-md">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-12">No messages yet</div>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${m.isOwn ? 'bg-[#3D52A0] text-white' : 'bg-gray-100 text-gray-900'}`}>
                      <p className="text-sm">{m.content}</p>
                      <p className="text-xs mt-1 text-gray-400">{m.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="border-t p-4 bg-white">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (newMessage.trim()) {
                        const msg: ChatMessage = { id: Date.now().toString(), senderId: currentUserId, content: newMessage.trim(), timestamp: new Date().toLocaleTimeString(), isOwn: true }
                        setMessages((prev) => [...prev, msg])
                        setNewMessage('')
                      }
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-md">
                  <Paperclip className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (!newMessage.trim()) return
                    const msg: ChatMessage = { id: Date.now().toString(), senderId: currentUserId, content: newMessage.trim(), timestamp: new Date().toLocaleTimeString(), isOwn: true }
                    setMessages((prev) => [...prev, msg])
                    setNewMessage('')
                  }}
                  className="px-4 py-2 bg-[#3D52A0] text-white rounded-md"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Owner-only member management controls */}
            {owners.some((o) => o.userId === currentUserId) && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Manage Project Group</h4>
                  <div className="text-xs text-gray-500">{collaborators.length} collaborators</div>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {collaborators.map((c) => (
                    <div key={c.userId} className="flex items-center justify-between p-2 bg-white rounded-md border">
                      <div className="flex items-center gap-3">
                        <img src={c.avatar ? `${API_URL}/${c.avatar}` : '/image/avatar/default.jpg'} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="text-sm font-medium">{c.name}</div>
                          <div className="text-xs text-gray-500">{c.email}</div>
                        </div>
                      </div>
                      <div>
                        {groupMembers.includes(c.userId) ? (
                          <button onClick={() => removeUserFromGroup(c.userId)} className="text-xs text-red-500">Remove</button>
                        ) : (
                          <button onClick={() => addUserToGroup(c.userId)} className="text-xs text-blue-500">Add</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {pmError && <div className="mt-2 text-sm text-red-500">{pmError}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
