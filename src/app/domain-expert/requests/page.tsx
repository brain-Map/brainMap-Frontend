'use client'
import { Calendar, Package } from "lucide-react"
import { useEffect, useState } from "react"


const requests = [
  {
    name: "Sachith Dhanushka",
    avatar: "SD",
    topic: "E-commerce Mobile App Development",
    package: "Premium Mentorship",
    message:
      "I'm building a full-stack e-commerce mobile app using React Native and Node.js. Need guidance on architecture, payment integration, and scalability best practices.",
    proposedSchedule: "Flexible, preferably evenings (after 6 PM EST)",
    date: "Today",
    status: "Pending",
  },
  {
    name: "Nadun Madusanka",
    avatar: "NM",
    topic: "AI-Powered Learning Management System",
    package: "Standard Mentorship",
    message:
      "Working on an LMS with AI features for personalized learning paths. Need help with machine learning model integration and user experience design.",
    proposedSchedule: "Weekends, morning sessions",
    date: "Yesterday",
    status: "Pending",
  },
  {
    name: "Isuru Naveen",
    avatar: "IN",
    topic: "IoT Smart Home Automation System",
    package: "Quick Consultation",
    message:
      "Developing an IoT system for home automation with sensor integration and mobile control. Looking for guidance on hardware-software integration and security.",
    proposedSchedule: "This Friday, 3 PM EST",
    date: "2 days ago",
    status: "Accepted",
  },
  {
    name: "Amaya Perera",
    avatar: "AP",
    topic: "Blockchain-based Supply Chain Tracker",
    package: "Premium Mentorship",
    message:
      "Creating a blockchain solution for supply chain transparency. Need mentorship on smart contract development and distributed system architecture.",
    proposedSchedule: "Weekdays, lunch hours (12-1 PM EST)",
    date: "3 days ago",
    status: "Declined",
  },
  {
    name: "Kasun Silva",
    avatar: "KS",
    topic: "Real-time Chat Application with Video Calls",
    package: "Standard Mentorship",
    message:
      "Building a comprehensive communication platform with real-time messaging and video calling features. Need help with WebRTC implementation and scalability.",
    proposedSchedule: "Tuesday & Thursday evenings",
    date: "4 days ago",
    status: "Pending",
  },
]

const tabs = ['Pending', 'Accepted', 'Declined', 'All']

export default function RequestsPage() {

  const [currentTab, setCurrentTab] = useState<string>('Pending')


  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Appointment Requests</h1>
          <p className="mt-2 text-gray-600">Manage incoming mentorship requests</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab, i) => (
                <button 
                key={i}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${currentTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setCurrentTab(tab)}>
                {tab} (3)
              </button>
              ))}
              {/* <button className={`py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm`}
              onClick={() => setCurrentTab('pending')}>
                Pending (3)
              </button>
              <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
              onClick={() => setCurrentTab('accepted')}>
                Accepted
              </button>
              <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
              onClick={() => setCurrentTab('declined')}>
                Declined
              </button>
              <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
              onClick={() => setCurrentTab('all')}>
                All Requests
              </button> */}
            </nav>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests
          .filter(request => currentTab == 'All' || currentTab == request.status)
          .map((request, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {request.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
                      <p className="text-sm text-gray-600">{request.topic}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">{request.date}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Package className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">Package:</span>
                      <span className="ml-2 text-gray-700">{request.package}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">Proposed Schedule:</span>
                      <span className="ml-2 text-gray-700">{request.proposedSchedule}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-900">Message from Student:</h4>
                    <p className="text-sm text-gray-600">{request.message}</p>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                      Decline
                    </button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors">
                      Accept Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
