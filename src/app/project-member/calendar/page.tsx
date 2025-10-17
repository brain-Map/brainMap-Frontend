import React from 'react'
import Calendar from '@/components/calendar/calendar';

const page = () => {
  
type EventType = "meeting" | "standup" | "review" | "planning" | "demo" | "coffee" | "lunch" | "dinner"

interface CalendarEvent {
  id: string
  title: string
  time: string
  endTime?: string
  type: EventType
  color: string
  date: Date
  description?: string
  location?: string
  attendees?: string[]
}

const events: CalendarEvent[] = [
    {
      id: "1",
      title: "Monday standup",
      time: "9:00 AM",
      endTime: "9:30 AM",
      type: "standup",
      color: "bg-blue-500",
      date: new Date(2025, 6, 6),
      description: "Weekly team standup meeting",
      location: "Conference Room A",
      attendees: ["Team Lead", "Developers"],
    },
    {
      id: "2",
      title: "One-on-one w...",
      time: "10:00 AM",
      endTime: "10:30 AM",
      type: "meeting",
      color: "bg-red-500",
      date: new Date(2025, 6, 2),
      description: "One-on-one meeting with manager",
      location: "Office",
    },
    {
      id: "3",
      title: "Friday standup",
      time: "9:00 AM",
      endTime: "9:30 AM",
      type: "standup",
      color: "bg-blue-500",
      date: new Date(2025, 6, 3),
    },
    {
      id: "4",
      title: "House Inspect...",
      time: "10:30 AM",
      endTime: "11:30 AM",
      type: "meeting",
      color: "bg-orange-500",
      date: new Date(2025, 6, 4),
    },
    {
      id: "5",
      title: "Coffee with client",
      time: "1:00 AM",
      endTime: "2:00 PM",
      type: "coffee",
      color: "bg-green-500",
      date: new Date(2025, 6, 6),
    },
    {
      id: "6",
      title: "All-hands meet...",
      time: "4:00 PM",
      endTime: "5:00 PM",
      type: "meeting",
      color: "bg-purple-500",
      date: new Date(2025, 6, 6),
    },
    {
      id: "7",
      title: "Dinner with C...",
      time: "6:00 PM",
      endTime: "8:00 PM",
      type: "dinner",
      color: "bg-green-500",
      date: new Date(2025, 6, 6),
    },
    {
      id: "8",
      title: "One-on-one w...",
      time: "10:00 AM",
      endTime: "10:30 AM",
      type: "meeting",
      color: "bg-red-500",
      date: new Date(2025, 6, 9),
    },
    {
      id: "9",
      title: "Deep work",
      time: "2:00 PM",
      endTime: "4:00 PM",
      type: "planning",
      color: "bg-blue-500",
      date: new Date(2025, 6, 9),
    },
    {
      id: "10",
      title: "Lunch with...",
      time: "12:00 PM",
      endTime: "1:00 PM",
      type: "lunch",
      color: "bg-green-500",
      date: new Date(2025, 6, 9),
    },
  ]
  return (
    <>
    <Calendar events={events} />
    </>
  )
}

export default page
