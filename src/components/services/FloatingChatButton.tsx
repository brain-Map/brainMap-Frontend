"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import { useStomp } from "@/hooks/useStomp"

interface FloatingChatButtonProps {
  mentorId: string
  mentorName: string
  mentorAvatar?: string
}

export function FloatingChatButton({
  mentorId,
  mentorName,
  mentorAvatar,
}: FloatingChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()
  const userId = user?.id || ""
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : ""

  const { publish, connect } = useStomp({ token, userId, onError: (e) => setError(typeof e === 'string' ? e : JSON.stringify(e)) })

  // ensure stomp connects when component mounts if credentials present
  useEffect(() => {
    if (token && userId) connect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId])

  const handleSendMessage = () => {
    if (!message.trim()) return

    // If not authenticated, save intent and redirect to login so user can continue
    if (!userId) {
      try {
        localStorage.setItem('openChatWith', JSON.stringify({ id: mentorId, name: mentorName }))
        localStorage.setItem('pendingMessage', message.trim())
      } catch (e) {
        // ignore storage failures
      }
      // redirect to login and return
      window.location.href = `/login?redirectTo=/chat`
      return
    }

    setIsSending(true)
    setError(null)

    const payload = {
      senderId: userId,
      receiverId: mentorId,
      message: message.trim(),
      status: "MESSAGE",
    }

    const sent = publish?.("/app/private-message", payload, { Authorization: `Bearer ${token}` })

    // set openChatWith so the full chat page opens the correct conversation
    try {
      localStorage.setItem('openChatWith', JSON.stringify({ id: mentorId, name: mentorName }))
      localStorage.removeItem('pendingMessage')
    } catch (e) {}

    if (sent) {
      // clear input and open full chat
      setMessage("")
      setIsSending(false)
      window.location.href = `/chat?mentorId=${mentorId}`
    } else {
      // fallback: navigate to chat and allow user to send from there
      setIsSending(false)
      setError('Unable to send message right now. Opening full chat...')
      window.location.href = `/chat?mentorId=${mentorId}`
    }
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] animate-in slide-in-from-bottom-5 duration-300">
          <Card className="shadow-2xl border-2 border-gray-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border-2 border-white">
                    <AvatarImage src={mentorAvatar} alt={mentorName} />
                    <AvatarFallback className="bg-white text-blue-600 font-bold">
                      {mentorName?.charAt(0) || "M"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {mentorName}
                    </CardTitle>
                    <p className="text-xs text-white">Usually responds in minutes</p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <div className="mb-4">
                <div className="bg-white rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700">
                    👋 Hi! I'm {mentorName}. Feel free to ask me anything about this
                    service or send me a message.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Textarea
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />

                <div className="flex gap-2">
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>

                <div className="text-center">
                  <Button
                    variant="link"
                    className="text-sm text-blue-600 hover:text-blue-700"
                    onClick={() => {
                      // Navigate to full chat page
                      window.location.href = `/chat?mentorId=${mentorId}`
                    }}
                  >
                    Open full chat →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${
          isOpen
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        } text-white`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>
    </>
  )
}
