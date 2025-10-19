"use client"

import React, { useEffect, useState, useRef, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, MoreVertical, Paperclip, Search, X } from "lucide-react"
import { useAuth } from '@/contexts/AuthContext'
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"

interface Props {
  projectId: string
  projectTitle: string | undefined
}

interface ChatMessage {
  id: string
  senderId: string
  content: string
  timestamp: string
  isOwn?: boolean
}

// Helper: determine if two messages are the same (used to dedupe between REST fetch and websocket)
const isSameMessage = (a: ChatMessage, b: ChatMessage) => {
  // Prefer strict id match if available
  if (a.id && b.id && a.id.toString() === b.id.toString()) return true
  // Fallback to comparing sender, content and timestamp (trim content)
  return (
    a.senderId === b.senderId &&
    (a.content || '').trim() === (b.content || '').trim() &&
    (a.timestamp || '') === (b.timestamp || '')
  )
}

// Helper: merge and dedupe arrays of ChatMessage preserving order (newer last)
const mergeDedupMessages = (existing: ChatMessage[], incoming: ChatMessage[]) => {
  const result: ChatMessage[] = [...existing]
  for (const m of incoming) {
    const exists = result.some((r) => isSameMessage(r, m))
    if (!exists) result.push(m)
  }
  return result
}

export default function ProjectChat({ projectId, projectTitle }: Props) {
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
  const { user } = useAuth()
  const [token, setToken] = useState<string>("")
  const [owners, setOwners] = useState<any[]>([])
  const [collaborators, setCollaborators] = useState<any[]>([])
  const [groupMembers, setGroupMembers] = useState<string[]>([])
  const [pmError, setPmError] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const stompClient = useRef<Client | null>(null)
  const groupSubscriptionRef = useRef<any>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [lastMessageId, setLastMessageId] = useState<number | null>(null)
  const [groupId, setGroupId] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const selectedUserRef = useRef<any | null>(selectedUser)

  // keep ref in sync so websocket handlers see latest selection
  useEffect(() => {
    selectedUserRef.current = selectedUser
  }, [selectedUser])
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const creatingGroupRef = useRef(false)
  const [groupMemberIds, setGroupMemberIds] = useState<string[]>([])

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('accessToken') || '' : ''
    setToken(t)
  }, [])

  useEffect(() => {
    if (!projectId) return
    setPmError(null)

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

    fetch(`${API_URL}/project-member/projects/collaborators/${projectId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setCollaborators(list)
        setGroupMembers(list.map((m: any) => m.userId))
      })
      .catch((e) => {
        console.error('Failed to fetch collaborators', e)
        setCollaborators([])
        setPmError((prev) => (prev ? prev + '; Failed to load collaborators' : 'Failed to load collaborators'))
      })
  }, [projectId, token])

  const addUserToGroup = (userId: string) => {
    if (!projectId) return
    // prefer group endpoint when available
    const gid = groupId
    fetch(`${API_URL}/api/v1/messages/group/${gid}/add-user/${userId}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((r) => {
        if (!r.ok) return Promise.reject(r)
        setGroupMembers((prev) => (prev.includes(userId) ? prev : [...prev, userId]))
        setGroupMemberIds((prev) => (prev.includes(userId) ? prev : [...prev, userId]))
      })
      .catch((e) => {
        console.error('Failed to add user to group', e)
        setPmError('Failed to add user to group')
      })
  }

  const removeUserFromGroup = (userId: string) => {
    if (!projectId) return
    const gid = groupId
    // prefer group endpoint when available
    const url = gid ? `${API_URL}/api/v1/messages/group/${gid}/remove-user/${userId}` : `${API_URL}/api/v1/messages/${projectId}/remove-user/${userId}`
    const method = 'DELETE'
    fetch(url, { method, headers: token ? { Authorization: `Bearer ${token}` } : undefined })
      .then((r) => {
        if (!r.ok) return Promise.reject(r)
        setGroupMembers((prev) => prev.filter((id) => id !== userId))
        setGroupMemberIds((prev) => prev.filter((id) => id !== userId))
      })
      .catch(() => {
        // fallback to POST
        fetch(url, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : undefined })
          .then((r) => {
            if (!r.ok) return Promise.reject(r)
            setGroupMembers((prev) => prev.filter((id) => id !== userId))
            setGroupMemberIds((prev) => prev.filter((id) => id !== userId))
          })
          .catch((e) => {
            console.error('Failed to remove user from group', e)
            setPmError('Failed to remove user from group')
          })
      })
  }

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [])

  // Fetch group messages
  const fetchGroupMessages = (groupId: string) => {
    if (!groupId || !token) return
    fetch(`${API_URL}/api/v1/messages/groups/${groupId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        console.log("Group Message: ", data);
        
        const list = Array.isArray(data) ? data : data.messages || []
        const apiMessages: ChatMessage[] = list.map((m: any, idx: number) => ({
          id: (m.id || m.messageId || m._id || idx)?.toString(),
          senderId: m.senderId,
          content: m.message || m.content || '',
          timestamp: m.time || m.timestamp || m.createdAt || '',
          isOwn: m.senderId === (user?.id || (typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '')),
        }))

        setMessages((prev) => {
          // If prev is empty, just set normalized apiMessages
          if (!prev || prev.length === 0) return apiMessages
          const merged = mergeDedupMessages(prev, apiMessages)
          return merged
        })
        setTimeout(scrollToBottom, 100)
      })
      .catch(() => {
        setPmError('Failed to load group messages')
        setMessages([])
      })
  }

  // Fetch private messages for a selected user
  const fetchPrivateMessages = (otherUserId: string) => {
    if (!otherUserId || !token) return
    fetch(`${API_URL}/api/v1/messages/chats/${currentUserId}/${otherUserId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        const apiMessages: ChatMessage[] = list.map((m: any, idx: number) => ({
          id: (m.id || m.messageId || idx)?.toString(),
          senderId: m.senderId,
          content: m.message || m.content || '',
          timestamp: m.time || m.timestamp || m.createdAt || '',
          isOwn: m.senderId === currentUserId,
        }))
        setMessages(apiMessages)
        setTimeout(scrollToBottom, 100)
      })
      .catch(() => {
        setPmError('Failed to load private messages')
        setMessages([])
      })
  }

    // Fetch group members (list of userIds) and sync local state
    const fetchGroupMembers = (gid: string) => {
      if (!gid || !token) return
      fetch(`${API_URL}/api/v1/messages/group/${gid}/get-all-users`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((data) => {
          const list = Array.isArray(data) ? data : []
          const ids = list.map((id: any) => String(id))
          setGroupMemberIds(ids)
          setGroupMembers(ids)
        })
        .catch((e) => {
          console.error('Failed to fetch group members', e)
        })
    }

  
  // Ensure group exists for this project; if not, create it with project collaborators
  const ensureGroupExists = async (collaborators: any) => {
      if (!projectId || !token || creatingGroupRef.current) return
    creatingGroupRef.current = true
    try {
      const res = await fetch(`${API_URL}/api/v1/messages/group/by-project/${projectId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })

      if (res.ok) {
          
          const gid = await res.json()
        if (gid) {
          setGroupId(gid.toString())
          // fetch messages for that group
          fetchGroupMessages(gid.toString())
        }
        creatingGroupRef.current = false
        return
      }

      // Not found -> create group with project members
      // Helper to extract a user id
      const extractId = (item: any): string | null => {
        if (!item && item !== 0) return null
        if (typeof item === 'string' || typeof item === 'number') return String(item)
        if (item.userId) return String(item.userId)
        if (item.id) return String(item.id)
        if (item.user && (item.user.id || item.user.userId)) return String(item.user.id || item.user.userId)
        return null
      }

      const collaboratorIds = Array.isArray(collaborators) && collaborators.length > 0 ? collaborators.map((c: any) => extractId(c)).filter(Boolean) as string[] : []
      const ownerIds = Array.isArray(owners) && owners.length > 0 ? owners.map((o: any) => extractId(o)).filter(Boolean) as string[] : []
      const combined = Array.from(new Set([...collaboratorIds, ...ownerIds])).filter(Boolean)
      const members = combined
      console.log('Resolved group members:', members)

      // If members is empty do not attempt to create the group
      if (!members || members.length === 0) {
        console.warn('No members found for project, skipping group creation')
        setPmError('No project members available to create group')
        creatingGroupRef.current = false
        return
      }

      const payload: any = { name: projectTitle, projectId, members: members }
      console.log("Memert: ", JSON.stringify(payload));
      const createRes = await fetch(`${API_URL}/api/v1/messages/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      if (!createRes.ok) {
        creatingGroupRef.current = false
        return
      }
      const created = await createRes.json()
      const newId = created?.id || created?.groupId || (created?.group && created.group.id) || null
      if (newId) {
        setGroupId(newId.toString())
        // set groupMembers state to reflect created members
        setGroupMembers(members)
        // make sure we load up-to-date group member list
        fetchGroupMembers(newId.toString())
        // fetch messages and subscribe after creation
        fetchGroupMessages(newId.toString())
      }
    } catch (e) {
      console.error('Failed to ensure/create group for project', e)
    } finally {
      creatingGroupRef.current = false
    }
  }

  // Subscribe to group messages
  const subscribeToGroup = (groupId: string) => {
    if (!stompClient.current?.connected || !groupId) return
    try {
      groupSubscriptionRef.current?.unsubscribe?.()
      groupSubscriptionRef.current = stompClient.current?.subscribe(
        `/group/${groupId}/messages`,
        (msg: any) => {
          try {
            const payload = JSON.parse(msg.body)
            const incoming: ChatMessage = {
              id: (payload.id || payload.messageId || Date.now()).toString(),
              senderId: payload.senderId,
              content: payload.message || payload.content || '',
              timestamp: payload.time || payload.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isOwn: payload.senderId === (user?.id || (typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '')),
            }

            setMessages((prev) => {
              // If message already exists, don't append
              const exists = prev.some((m) => isSameMessage(m, incoming))
              if (exists) return prev
              const next = [...prev, incoming]
              return next
            })
            // lastMessageId is numeric (or null) in state; try to coerce incoming.id to a number
            const numericId = Number(incoming.id)
            setLastMessageId(Number.isFinite(numericId) ? numericId : null)
          } catch (e) {
            console.error('Failed parsing group message', e)
          }
        },
        { Authorization: `Bearer ${token}` }
      )
    } catch (e) {
      console.error('Failed to subscribe to group', e)
    }
  }

  // Subscribe to private user queue when websocket connected and a user selected
  const privateSubscriptionRef = useRef<any>(null)
  const subscribeToPrivateUser = (otherUserId: string) => {
    if (!stompClient.current?.connected || !otherUserId) return
    try {
      privateSubscriptionRef.current?.unsubscribe?.()
      // subscribe to /user/{currentUserId}/private is handled by server to route private messages
      privateSubscriptionRef.current = { subscribedTo: otherUserId }
    } catch (e) {
      console.error('Failed to subscribe to private user', e)
    }
  }

  const unsubscribePrivate = () => {
    try {
      privateSubscriptionRef.current?.unsubscribe?.()
      privateSubscriptionRef.current = null
    } catch (e) {
      // ignore
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

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    // send via websocket if available
    if (stompClient.current?.connected) {
      // If a user is selected, send private message
      if (selectedUser) {
        const chatMessage = {
          senderId: user?.id || '',
          receiverId: selectedUser.userId || selectedUser.id,
          message: newMessage.trim(),
          status: 'MESSAGE',
        }
        stompClient.current.publish({
          destination: '/app/private-message',
          body: JSON.stringify(chatMessage),
          headers: { Authorization: `Bearer ${token}` },
        })
        const newMsg: ChatMessage = { id: Date.now().toString(), senderId: user?.id || '', content: newMessage.trim(), timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isOwn: true }
        setMessages((prev) => [...prev, newMsg])
        setLastMessageId(Number(newMsg.id))
        setNewMessage('')
        setTimeout(scrollToBottom, 50)
        return
      }

      // Otherwise send to group
      if (groupId || projectId) {
        const gid = groupId || projectId
        const groupMessage = {
          senderId: user?.id || '',
          groupId: gid,
          message: newMessage.trim(),
          status: 'GROUP_MESSAGE',
        }
        stompClient.current.publish({
          destination: '/app/group-message',
          body: JSON.stringify(groupMessage),
          headers: { Authorization: `Bearer ${token}` },
        })
        const newMsg: ChatMessage = { id: Date.now().toString(), senderId: user?.id || '', content: newMessage.trim(), timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isOwn: true }
        setMessages((prev) => [...prev, newMsg])
        setLastMessageId(Number(newMsg.id))
        setNewMessage('')
        setTimeout(scrollToBottom, 50)
        return
      }
    }

    // fallback local push
    const msg: ChatMessage = { id: Date.now().toString(), senderId: user?.id || '', content: newMessage.trim(), timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isOwn: true }
    setMessages((prev) => [...prev, msg])
    setNewMessage('')
    setTimeout(scrollToBottom, 50)
  }

  useEffect(() => {
    // auto scroll when messages change
    setTimeout(scrollToBottom, 100)
  }, [messages, scrollToBottom])

  // WebSocket connect/disconnect
  useEffect(() => {
    if (!token || !user?.id) return
    stompClient.current = new Client({
      webSocketFactory: () => new SockJS(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:8080/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (str) => console.log('STOMP Debug:', str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log(`WebSocket connected for user: ${user.id}`)
        setIsConnected(true)
        // server may subscribe to /user/{id}/private implicitly; incoming group/private handling implemented in subscription callback below
        try {
          stompClient.current?.subscribe(
            `/user/${user.id}/private`,
            (msg: any) => {
              try {
                const payload = JSON.parse(msg.body)
                // route private messages into messages when appropriate
                const incoming: ChatMessage = {
                  id: (payload.id || Date.now()).toString(),
                  senderId: payload.senderId,
                  content: payload.message || payload.content || '',
                  timestamp: payload.time || payload.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  isOwn: payload.senderId === (user?.id || (typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '')),
                }
                // Use ref to avoid stale closure for selectedUser
                const sel = selectedUserRef.current
                const otherId = payload.senderId === user?.id ? payload.receiverId : payload.senderId
                if (sel && String(otherId) === String(sel.userId || sel.id)) {
                  setMessages((prev) => {
                    if (prev.some((m) => isSameMessage(m, incoming))) return prev
                    return [...prev, incoming]
                  })
                }
                setLastMessageId(Number.isFinite(Number(incoming.id)) ? Number(incoming.id) : null)
              } catch (e) {
                console.error('Failed parsing private message', e)
              }
            },
            { Authorization: `Bearer ${token}` }
          )
        } catch (e) {
          console.error('failed to subscribe to user private', e)
        }
        // subscribe to group messages for this project (if groupId already resolved)
        if (groupId) subscribeToGroup(groupId)
        // announce join
        stompClient.current?.publish({
          destination: '/app/group-message',
          body: JSON.stringify({ senderId: user.id, groupId: groupId || projectId, message: '', status: 'JOIN' }),
          headers: { Authorization: `Bearer ${token}` },
        })
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers?.message || 'Unknown')
      },
      onWebSocketError: (error) => {
        console.error('WebSocket connection failed:', error)
      },
    })

    stompClient.current.activate()
    return () => {
      try {
        unsubscribeGroup()
        stompClient.current?.deactivate()
        setIsConnected(false)
      } catch (e) {
        // ignore
      }
    }
  }, [token, user?.id, projectId])

  // when groupId becomes available, subscribe if websocket connected
  // when groupId becomes available, fetch messages and subscribe only when websocket is connected
  useEffect(() => {
    if (!groupId) return
    fetchGroupMessages(groupId)
    if (isConnected) subscribeToGroup(groupId)
    // also fetch latest group member list whenever groupId changes
    fetchGroupMembers(groupId)
  }, [groupId, isConnected])

  // ensure group exists when we have collaborators and token
  useEffect(() => {
    if (!projectId || !token) return
    ensureGroupExists(collaborators)
  }, [projectId, token, collaborators])

  // (group messages are fetched when groupId is resolved)

  // Search users for adding to group
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        setSearchLoading(false)
        return
      }
      setSearchLoading(true)
      fetch(`${API_URL}/api/v1/users/chat/search?query=${encodeURIComponent(searchQuery.trim())}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((data) => {
          const users = Array.isArray(data) ? data : [data]
          const mappedResults = users
            .filter((u: any) => u.userId !== (user?.id || (typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '')))
            .map((u: any) => ({ id: u.userId, name: `${u.firstName || ''} ${u.lastName || ''}`.trim(), username: u.username || '', avatar: u.avatarUrl || '/image/avatar/default.jpg' }))
          setSearchResults(mappedResults)
          setSearchLoading(false)
        })
        .catch(() => {
          setSearchResults([])
          setSearchLoading(false)
        })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, token, user?.id])

  const currentUserId = user?.id || (typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '')
  const isOwner = owners && owners.length > 0 && owners.some((o: any) => String(o.userId) === String(currentUserId))

  return (
    <div className="flex h-[85vh] bg-white">
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-medium">Members</h5>
            <div className="text-xs text-gray-500">{collaborators.length} collaborators</div>
          </div>
          <div className="space-y-2">
            {/* Group selector at top */}
            <div className={`flex items-center gap-3 p-2 rounded-md border cursor-pointer ${!selectedUser ? 'bg-[#3D52A0]/5' : ''}`} onClick={() => { setSelectedUser(null); if (groupId) { fetchGroupMessages(groupId) } }}>
              <Avatar className="h-8 w-8">
                <AvatarFallback>G</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm font-medium">Group chat</div>
                <div className="text-xs text-gray-500">Project group</div>
              </div>
            </div>

            {collaborators.map((c) => (
              <div key={c.userId} className={`flex items-center justify-between p-2 bg-white rounded-md border cursor-pointer ${selectedUser && String(selectedUser.userId || selectedUser.id) === String(c.userId) ? 'bg-[#3D52A0]/5' : ''}`} onClick={() => { setSelectedUser(c); unsubscribeGroup(); unsubscribePrivate(); fetchPrivateMessages(c.userId || c.id); }}>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={c.avatar ? `${API_URL}/${c.avatar}` : '/image/avatar/default.jpg'} />
                    <AvatarFallback>{c.name?.[0] || c.userId?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.email}</div>
                  </div>
                </div>
                <div>
                  {isOwner ? (
                    groupMembers.includes(c.userId) ? (
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={(e) => { e.stopPropagation(); removeUserFromGroup(c.userId) }}>Remove</Button>
                    ) : (
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); addUserToGroup(c.userId) }}>Add</Button>
                    )
                  ) : (
                    groupMembers.includes(c.userId) ? (
                      <Badge>Member</Badge>
                    ) : (
                      <div className="text-xs text-gray-400">Not in group</div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

  <div className="flex-1 flex flex-col">
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-12">No messages yet</div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.isOwn ? 'justify-end' : ''}`}>
                {!m.isOwn && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback>{m.senderId?.toString()?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-md ${m.isOwn ? 'order-first' : ''}`}>
                  <div className={`rounded-2xl p-3 ${m.isOwn ? 'bg-[#3D52A0] text-white' : 'bg-gray-100 text-gray-900'}`}>
                    <p className="text-sm">{m.content}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <span className="text-xs text-gray-500">{m.timestamp}</span>
                    {m.isOwn && <div className="text-[#3D52A0]">✓✓</div>}
                  </div>
                </div>
                {m.isOwn && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-b border-gray-200 bg-white">
          {/* Header: show selected user or group */}
          {selectedUser ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedUser.avatar ? `${API_URL}/${selectedUser.avatar}` : '/image/avatar/default.jpg'} />
                  <AvatarFallback>{selectedUser.name?.[0] || selectedUser.userId?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedUser.name || selectedUser.email || selectedUser.userId}</h3>
                  <p className="text-sm text-[#3D52A0]">Online</p>
                </div>
              </div>
              <div />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>G</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{projectTitle || 'Project Group'}</h3>
                  <p className="text-sm text-[#3D52A0]">Group chat</p>
                </div>
              </div>
              <div />
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-white">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5 text-gray-500" /></Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Write a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="pr-12 rounded-full border-gray-200"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
            </div>
            <Button size="icon" className="rounded-full bg-[#3D52A0] hover:bg-[#3D52A0]/90" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
