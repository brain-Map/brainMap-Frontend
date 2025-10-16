"use client"

import { useState } from "react"
import {
  Video,
  Calendar,
  Clock,
  Users,
  Mic,
  MicOff,
  VideoIcon,
  VideoOff,
  PhoneOff,
  Settings,
  Plus,
  MoreVertical,
  Maximize2,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface VideoCall {
  id: string
  studentName: string
  studentAvatar: string
  time: string
  topic: string
  date: string
  status: "upcoming" | "ongoing" | "completed"
  duration?: string
}

export default function VideoCallsPage() {
  const [isVideoCallActive, setIsVideoCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [activeCallStudent, setActiveCallStudent] = useState("")
  const router = useRouter()

  const openFullScreenCall = () => {
    router.push(`/domain-expert/video-calls/call?student=${encodeURIComponent(activeCallStudent)}`)
  }

  const upcomingCalls: VideoCall[] = [
    {
      id: "1",
      studentName: "Emily Davis",
      studentAvatar: "ED",
      time: "11:00 AM - 12:00 PM",
      topic: "Project Review Session",
      date: "Today",
      status: "upcoming",
    },
    {
      id: "2",
      studentName: "James Wilson",
      studentAvatar: "JW",
      time: "2:30 PM - 3:30 PM",
      topic: "Career Guidance Discussion",
      date: "Today",
      status: "upcoming",
    },
    {
      id: "3",
      studentName: "Sarah Williams",
      studentAvatar: "SW",
      time: "10:00 AM - 11:00 AM",
      topic: "Algorithm Problem Solving",
      date: "Tomorrow",
      status: "upcoming",
    },
    {
      id: "4",
      studentName: "Michael Brown",
      studentAvatar: "MB",
      time: "3:00 PM - 4:00 PM",
      topic: "Code Review Session",
      date: "Tomorrow",
      status: "upcoming",
    },
  ]

  const recentCalls: VideoCall[] = [
    {
      id: "5",
      studentName: "Alex Johnson",
      studentAvatar: "AJ",
      time: "9:00 AM - 10:00 AM",
      topic: "Machine Learning Concepts",
      date: "Yesterday",
      status: "completed",
      duration: "58 min",
    },
    {
      id: "6",
      studentName: "David Chen",
      studentAvatar: "DC",
      time: "2:00 PM - 2:45 PM",
      topic: "Database Design Review",
      date: "Yesterday",
      status: "completed",
      duration: "45 min",
    },
    {
      id: "7",
      studentName: "Lisa Rodriguez",
      studentAvatar: "LR",
      time: "4:00 PM - 5:00 PM",
      topic: "System Architecture Discussion",
      date: "2 days ago",
      status: "completed",
      duration: "60 min",
    },
  ]

  const startVideoCall = (studentName: string) => {
    setActiveCallStudent(studentName)
    setIsVideoCallActive(true)
    console.log("Starting video call with:", studentName)
  }

  const endVideoCall = () => {
    setIsVideoCallActive(false)
    setIsMuted(false)
    setIsVideoEnabled(true)
    setActiveCallStudent("")
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Video Calls</h1>
          <p className="mt-2 text-gray-600">Manage your video sessions and calls with students</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            <Plus className="mr-2 h-4 w-4" />
            Schedule New Call
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Users className="mr-2 h-4 w-4" />
            Group Session
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upcoming Calls */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Video Calls</h2>
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {upcomingCalls.length} scheduled
                </div>
              </div>
              <div className="space-y-4">
                {upcomingCalls.map((call) => (
                  <div
                    key={call.id}
                    className="flex items-center justify-between rounded-lg border border-gray-300 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {call.studentAvatar}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{call.studentName}</h4>
                        <p className="text-sm text-gray-600">{call.topic}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="mr-1 h-3 w-3" />
                          <span>{call.date}</span>
                          <span className="mx-2">•</span>
                          <Clock className="mr-1 h-3 w-3" />
                          <span>{call.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        Reschedule
                      </button>
                      <button
                        onClick={() => startVideoCall(call.studentName)}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                      >
                        <Video className="mr-1 h-4 w-4" />
                        Join Call
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Calls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Calls</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
              </div>
              <div className="space-y-4">
                {recentCalls.map((call) => (
                  <div key={call.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {call.studentAvatar}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{call.studentName}</h4>
                        <p className="text-sm text-gray-600">{call.topic}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="mr-1 h-3 w-3" />
                          <span>{call.date}</span>
                          <span className="mx-2">•</span>
                          <Clock className="mr-1 h-3 w-3" />
                          <span>{call.time}</span>
                          {call.duration && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{call.duration}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        View Notes
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Call Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Calls This Week</span>
                  <span className="text-lg font-semibold text-gray-900">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Hours</span>
                  <span className="text-lg font-semibold text-gray-900">18.5h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Duration</span>
                  <span className="text-lg font-semibold text-gray-900">52 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="text-lg font-semibold text-green-600">98%</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Video Call Modal */}
        {isVideoCallActive && (
          <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 h-[80vh] shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Video Call with {activeCallStudent}</h3>
                <div className="text-gray-600 text-sm">Call duration: 00:05:23</div>
                <button
                    onClick={openFullScreenCall}
                    className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <Maximize2 className="mr-1 h-4 w-4" />
                    Full Screen
                  </button>
              </div>
              <div className="space-y-4 h-full">
                {/* Video Area */}
                <div className="relative aspect-video rounded-lg bg-gray-100 border border-gray-200 flex-1">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                    <div className="text-center">
                      <VideoIcon className="mx-auto h-16 w-16 mb-4 opacity-50" />
                      <p className="text-lg">Video call with {activeCallStudent}</p>
                      <p className="text-sm opacity-75">Integration with video SDK required</p>
                    </div>
                  </div>

                  {/* Local video preview */}
                  <div className="absolute bottom-4 right-4 h-32 w-48 rounded-lg bg-gray-200 border-2 border-gray-300">
                    <div className="flex h-full items-center justify-center text-gray-600 text-sm">Your Video</div>
                  </div>
                </div>

                {/* Call Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${
                      isMuted ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                    }`}
                  >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>

                  <button
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${
                      !isVideoEnabled ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                    }`}
                  >
                    {isVideoEnabled ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </button>

                  <button
                    onClick={endVideoCall}
                    className="h-12 w-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <PhoneOff className="h-5 w-5" />
                  </button>

                  <button className="h-12 w-12 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors border border-gray-300">
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
