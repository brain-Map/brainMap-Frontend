"use client"

import { useState, useEffect } from "react"

// Extend the Window type to include JitsiMeetExternalAPI
declare global {
  interface Window {
    JitsiMeetExternalAPI?: any
  }
}
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Check,
  Plus,
  LogIn,
  Loader2,
  X
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import toast, { Toaster } from "react-hot-toast"
import { JitsiMeetAPI, JitsiMeetConfig } from "@/types/jitsi"

interface Meeting {
  id: string
  roomName: string
  title: string
  createdBy: string
  createdAt: string
  isActive: boolean
  participants: number
  maxParticipants?: number
  startTime?: string
  endTime?: string
}

export default function VideoCallPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [activeView, setActiveView] = useState<'home' | 'create' | 'join' | 'meeting'>('home')
  const [meetingTitle, setMeetingTitle] = useState("")
  const [meetingId, setMeetingId] = useState("")
  const [loadingAction, setLoadingAction] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null)

  const [jitsiApi, setJitsiApi] = useState<any>(null)
  const [jitsiLoaded, setJitsiLoaded] = useState(false)

  // Check if user is authenticated
  const isAuthenticated = !loading && user !== null

  useEffect(() => {
    // Load Jitsi script once when component mounts
    const loadJitsiScript = () => {
      if (window.JitsiMeetExternalAPI) {
        setJitsiLoaded(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://meet.jit.si/external_api.js'
      script.onload = () => {
        setJitsiLoaded(true)
      }
      script.onerror = () => {
        console.error('Failed to load Jitsi script')
        toast.error('Failed to load video call components')
      }
      document.head.appendChild(script)
    }

    loadJitsiScript()
  }, [])

  useEffect(() => {
    // Check if user is trying to join a specific meeting
    const meetingParam = searchParams.get('meeting')
    if (meetingParam) {
      setMeetingId(meetingParam)
      setActiveView('join')
    }
  }, [searchParams])

  useEffect(() => {
    // Auto-start Jitsi when meeting is loaded and script is ready
    if (currentMeeting && jitsiLoaded && activeView === 'meeting') {
      startVideoCall()
    }
  }, [currentMeeting, jitsiLoaded, activeView])

  useEffect(() => {
    // Cleanup function to dispose Jitsi API when component unmounts
    return () => {
      if (jitsiApi) {
        jitsiApi.dispose()
      }
    }
  }, [jitsiApi])

  const createMeeting = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to create a meeting")
      return
    }

    if (!meetingTitle.trim()) {
      toast.error("Please enter a title for your meeting")
      return
    }

    setLoadingAction(true)
    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem('accessToken')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      
      // Debug logging
      console.log('API URL:', apiUrl)
      console.log('Access Token:', accessToken ? 'Present' : 'Missing')
      
      if (!apiUrl) {
        throw new Error('API URL not configured. Please set NEXT_PUBLIC_API_URL environment variable.')
      }
      
      if (!accessToken) {
        throw new Error('No access token found. Please log in again.')
      }
      
      // Call Spring Boot API to create meeting
      const response = await fetch(`${apiUrl}/api/v1/meetings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          title: meetingTitle
          // Note: createdBy is automatically set from JWT token in backend
        })
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        
        if (response.status === 404) {
          throw new Error('Backend API endpoint not found. Please ensure the backend server is running.')
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.')
        } else if (response.status === 403) {
          throw new Error('You do not have permission to create meetings.')
        } else if (response.status === 400) {
          throw new Error('Invalid meeting data. Please check your input.')
        } else {
          throw new Error(`Server error (${response.status}): ${errorText || 'Unknown error'}`)
        }
      }

      const meeting: Meeting = await response.json()
      setCurrentMeeting(meeting)
      setActiveView('meeting')
      
      toast.success("Your meeting room is ready!")

      // Update URL with meeting ID
      window.history.pushState({}, '', `/video-call?meeting=${meeting.id}`)
      
    } catch (error) {
      console.error('Error creating meeting:', error)
      toast.error(error instanceof Error ? error.message : "Failed to create meeting. Please try again.")
    } finally {
      setLoadingAction(false)
    }
  }

  const joinMeeting = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to join a meeting")
      return
    }

    if (!meetingId.trim()) {
      toast.error("Please enter a valid meeting ID")
      return
    }

    setLoadingAction(true)
    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem('accessToken')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      
      if (!apiUrl) {
        throw new Error('API URL not configured. Please set NEXT_PUBLIC_API_URL environment variable.')
      }
      
      if (!accessToken) {
        throw new Error('No access token found. Please log in again.')
      }
      
      // Call Spring Boot API to get meeting details
      const response = await fetch(`${apiUrl}/api/v1/meetings/${meetingId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        
        if (response.status === 404) {
          throw new Error('Meeting not found. Please check the meeting ID.')
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.')
        } else if (response.status === 403) {
          throw new Error('You do not have permission to join this meeting.')
        } else {
          throw new Error(`Server error (${response.status}): ${errorText || 'Unknown error'}`)
        }
      }

      const meeting: Meeting = await response.json()
      setCurrentMeeting(meeting)
      setActiveView('meeting')
      
      toast.success(`Connecting to ${meeting.title}...`)
      
    } catch (error) {
      console.error('Error joining meeting:', error)
      toast.error(error instanceof Error ? error.message : "Meeting not found or you don't have permission to join.")
    } finally {
      setLoadingAction(false)
    }
  }

  const copyMeetingLink = async () => {
    if (!currentMeeting) return
    
    const meetingUrl = `${window.location.origin}/video-call?meeting=${currentMeeting.id}`
    
    try {
      await navigator.clipboard.writeText(meetingUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
      toast.success("Meeting link copied to clipboard")
    } catch (err) {
      console.error('Failed to copy meeting link:', err)
      toast.error("Failed to copy link. Please try again.")
    }
  }

  const startVideoCall = () => {
    if (!currentMeeting || !jitsiLoaded) return
    
    // Clean up existing API instance
    if (jitsiApi) {
      jitsiApi.dispose()
    }

    const domain = 'meet.jit.si'
    const options: JitsiMeetConfig = {
      roomName: currentMeeting.roomName,
      width: '100%',
      height: '100%',
      parentNode: document.getElementById('jitsi-container'),
      userInfo: {
        displayName: user?.name || 'Guest User',
        email: user?.email || undefined
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        enableClosePage: false,
        prejoinPageEnabled: false,
        disableDeepLinking: true
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
          'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
        ],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false
      }
    }
    
    try {
      // @ts-ignore - JitsiMeetExternalAPI is loaded dynamically
      const api = new window.JitsiMeetExternalAPI(domain, options)
      setJitsiApi(api)
      
      // Handle meeting events
      api.addListener('videoConferenceJoined', (event: any) => {
        console.log('User joined the meeting:', event)
        toast.success('Successfully joined the meeting')
      })
      
      api.addListener('videoConferenceLeft', (event: any) => {
        console.log('User left the meeting:', event)
        // Clean up and navigate back
        setJitsiApi(null)
        setCurrentMeeting(null)
        setActiveView('home')
        router.push('/video-call')
      })

      api.addListener('participantJoined', (event: any) => {
        console.log('Participant joined:', event)
      })

      api.addListener('participantLeft', (event: any) => {
        console.log('Participant left:', event)
      })

      api.addListener('readyToClose', () => {
        console.log('Meeting is ready to close')
        setJitsiApi(null)
        setCurrentMeeting(null)
        setActiveView('home')
        router.push('/video-call')
      })

    } catch (error) {
      console.error('Error initializing Jitsi:', error)
      toast.error('Failed to start video call')
    }
  }

  // Render different views based on activeView state
  if (activeView === 'meeting' && currentMeeting) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Meeting Header */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 p-3 relative z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Video className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 text-sm">{currentMeeting.title}</h1>
                <p className="text-xs text-gray-500">Room: {currentMeeting.roomName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyMeetingLink}
                className="flex items-center gap-1 text-xs"
              >
                {copySuccess ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy Link
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  if (jitsiApi) {
                    jitsiApi.dispose()
                    setJitsiApi(null)
                  }
                  setCurrentMeeting(null)
                  setActiveView('home')
                  router.push('/video-call')
                }}
                className="flex items-center gap-1 text-xs"
              >
                <X className="w-3 h-3" />
                Leave
              </Button>
            </div>
          </div>
        </div>

        {/* Jitsi Container */}
        <div id="jitsi-container" className="w-full h-[calc(100vh-64px)]">
          {!jitsiLoaded && (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center space-y-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900">Loading Video Call</h3>
                <p className="text-gray-600">Preparing your meeting room...</p>
              </div>
            </div>
          )}
          {jitsiLoaded && !jitsiApi && (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center space-y-4">
                <Video className="w-12 h-12 text-primary mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900">Connecting to Meeting</h3>
                <p className="text-gray-600">Joining {currentMeeting.title}...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto pt-30 space-y-6">
        {/* Header
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            BrainMap Video Calls
          </h1>
          <p className="text-lg text-gray-600">
            Connect, collaborate, and communicate with your team
          </p>
        </div> */}

        {/* Main Actions */}
        {activeView === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Meeting */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  Create New Meeting
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Start a video call and invite participants
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setActiveView('create')}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  disabled={!isAuthenticated}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Meeting
                </Button>
                {!isAuthenticated && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Please log in to create meetings
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Join Meeting */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  Join Meeting
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Enter a meeting ID to join an existing call
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setActiveView('join')}
                  variant="outline"
                  className="w-full border-secondary text-secondary hover:bg-secondary/10"
                  disabled={!isAuthenticated}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Join Meeting
                </Button>
                {!isAuthenticated && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Please log in to join meetings
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Meeting Form */}
        {activeView === 'create' && (
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Create New Meeting</CardTitle>
              <p className="text-gray-600">Set up your video call</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="meeting-title">Meeting Title</Label>
                <Input
                  id="meeting-title"
                  type="text"
                  placeholder="Enter meeting title (e.g., Team Standup, Project Review)"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Meeting Host</span>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.profile_picture} />
                    <AvatarFallback className="bg-primary text-white">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                    <Badge variant="secondary" className="text-xs">Host</Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setActiveView('home')}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createMeeting}
                  disabled={loadingAction || !meetingTitle.trim()}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                >
                  {loadingAction ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4 mr-2" />
                      Create Meeting
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Join Meeting Form */}
        {activeView === 'join' && (
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Join Meeting</CardTitle>
              <p className="text-gray-600">Enter the meeting ID to join</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="meeting-id">Meeting ID</Label>
                <Input
                  id="meeting-id"
                  type="text"
                  placeholder="Enter meeting ID (e.g., brainmap-abc123)"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="bg-gradient-to-r from-secondary/5 to-value1/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Joining as</span>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.profile_picture} />
                    <AvatarFallback className="bg-secondary text-white">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                    <Badge variant="outline" className="text-xs">Participant</Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setActiveView('home')}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={joinMeeting}
                  disabled={loadingAction || !meetingId.trim()}
                  className="flex-1 bg-secondary hover:bg-secondary/90 text-white"
                >
                  {loadingAction ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Join Meeting
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
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
      <Toaster />
    </div>
  )
}
