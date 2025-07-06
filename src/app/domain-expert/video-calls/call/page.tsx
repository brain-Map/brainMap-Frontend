"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Mic,
  MicOff,
  VideoIcon,
  VideoOff,
  PhoneOff,
  Settings,
  MessageSquare,
  Users,
  Share,
  ArrowLeft,
  MoreVertical,
} from "lucide-react"

export default function VideoCallPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const studentName = searchParams.get('student') || 'Student'
  
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  // Call duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const endCall = () => {
    router.back()
  }

  const goBack = () => {
    router.back()
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={goBack}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Video Call with {studentName}</h1>
              <p className="text-sm text-gray-600">Duration: {formatDuration(callDuration)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Share className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Users className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex">
        {/* Video Content */}
        <div className="flex-1 relative bg-gray-900">
          {/* Remote Video */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <VideoIcon className="mx-auto h-24 w-24 mb-6 opacity-50" />
              <h2 className="text-2xl font-semibold mb-2">{studentName}</h2>
              <p className="text-gray-300">Video call in progress</p>
              <p className="text-sm text-gray-400 mt-2">Integration with video SDK required</p>
            </div>
          </div>

          {/* Local Video (Picture in Picture) */}
          <div className="absolute top-6 right-6 w-64 h-48 bg-gray-800 rounded-lg border-2 border-gray-600 overflow-hidden">
            <div className="flex h-full items-center justify-center text-white text-sm">
              <div className="text-center">
                <VideoIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>Your Video</p>
              </div>
            </div>
          </div>

          {/* Call Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-lg">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${
                  !isVideoEnabled ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {isVideoEnabled ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </button>

              <button
                onClick={endCall}
                className="h-12 w-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <PhoneOff className="h-5 w-5" />
              </button>

              <button className="h-12 w-12 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Settings className="h-5 w-5" />
              </button>

              <button
                onClick={() => setShowChat(!showChat)}
                className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${
                  showChat ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <MessageSquare className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="text-center text-sm text-gray-500">
                  Chat started
                </div>
                {/* Sample messages */}
                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white rounded-lg px-3 py-2 max-w-xs">
                    <p className="text-sm">Hello! Ready for our session?</p>
                    <p className="text-xs opacity-75 mt-1">2:30 PM</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 rounded-lg px-3 py-2 max-w-xs">
                    <p className="text-sm">Yes, let's get started!</p>
                    <p className="text-xs text-gray-500 mt-1">2:31 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}