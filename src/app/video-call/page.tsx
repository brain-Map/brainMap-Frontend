"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import JitsiMeeting from "@/components/video-call/JitsiMeeting"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Settings, 
  Users, 
  Clock, 
  Calendar,
  Share2,
  Copy,
  Check
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface MeetingParticipant {
  id: string
  name: string
  avatar?: string
  role?: string
  isHost?: boolean
}

export default function MeetingPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [meetingStarted, setMeetingStarted] = useState(false)
  const [roomName, setRoomName] = useState("")
  const [meetingTitle, setMeetingTitle] = useState("")
  const [participants, setParticipants] = useState<MeetingParticipant[]>([])
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    // Get room details from URL params or generate new ones
    const urlRoomName = searchParams.get('room') || `brainmap-${Date.now()}`
    const urlMeetingTitle = searchParams.get('title') || 'BrainMap Video Call'
    
    setRoomName(urlRoomName)
    setMeetingTitle(urlMeetingTitle)

    // Mock participants data - in real app, this would come from your API
    setParticipants([
      {
        id: '1',
        name: user?.name || 'You',
        avatar: user?.profile_picture,
        role: 'Host',
        isHost: true
      }
    ])
  }, [searchParams, user])

  const handleStartMeeting = () => {
    setMeetingStarted(true)
  }

  const copyMeetingLink = async () => {
    const meetingUrl = `${window.location.origin}/video-call?room=${roomName}&title=${encodeURIComponent(meetingTitle)}`
    
    try {
      await navigator.clipboard.writeText(meetingUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy meeting link:', err)
    }
  }

  if (meetingStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary/30 via-value3/30 to-secondary/30">
        <JitsiMeeting
          roomName={roomName}
          user={{ 
            name: user?.name || 'Guest User',
            email: user?.email,
            avatar: user?.profile_picture,
            id: user?.id
          }}
          configOverwrite={{
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            enableWelcomePage: false,
            enableClosePage: false,
            prejoinPageEnabled: false
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/30 via-value3/30 to-secondary/30 p-6">
      <div className="max-w-4xl mx-auto pt-20 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Join Video Call
          </h1>
          <p className="text-lg text-gray-600">
            Connect, collaborate, and communicate with your team
          </p>
        </div>

        {/* Main Meeting Card */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl text-gray-900">
              {meetingTitle}
            </CardTitle>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              <Clock className="w-4 h-4 ml-4" />
              <span>{new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Meeting Info */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">Meeting Room</p>
                  <p className="text-lg font-mono text-primary truncate">{roomName}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyMeetingLink}
                  className="flex items-center gap-2"
                >
                  {copySuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Participants Preview */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">
                  Participants ({participants.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100 shadow-sm"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback className="bg-primary text-white">
                        {participant.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {participant.name}
                      </p>
                      {participant.role && (
                        <Badge variant="secondary" className="text-xs">
                          {participant.role}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Join Meeting Actions */}
            <div className="flex flex-col gap-4 pt-4">
              <Button
                onClick={handleStartMeeting}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 text-lg"
              >
                <Video className="w-5 h-5 mr-2" />
                Join Meeting
              </Button>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 flex items-center gap-2"
                  onClick={copyMeetingLink}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Meeting Tips */}
            <div className="bg-info/5 border border-info/20 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                💡 Meeting Tips
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Make sure you have a stable internet connection</li>
                <li>• Use headphones for better audio quality</li>
                <li>• Test your camera and microphone before joining</li>
                <li>• Share the meeting link with participants in advance</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Video className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="font-medium text-gray-900">HD Video</p>
              <p className="text-sm text-gray-500">Crystal clear video calls</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Share2 className="w-8 h-8 text-secondary mx-auto mb-2" />
              <p className="font-medium text-gray-900">Screen Share</p>
              <p className="text-sm text-gray-500">Share your screen easily</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-value1 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Team Chat</p>
              <p className="text-sm text-gray-500">Built-in messaging</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
