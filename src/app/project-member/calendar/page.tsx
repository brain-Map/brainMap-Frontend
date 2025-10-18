import React from 'react'
import Calendar from '@/components/calendar/calendar';

const page = () => {
  
type EventType = "meeting" | "standup" | "review" | "planning" | "demo" | "coffee" | "lunch" | "dinner"

// Rename the page-local event type to avoid colliding with the component's CalendarEvent type
interface PageEvent {
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

const events: PageEvent[] = [
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
  // Helper: convert 12-hour time like "9:00 AM" to "09:00"
  const parse12HourTo24 = (time12?: string) => {
    if (!time12) return ''
    // Support formats like "9:00 AM", "12:30 PM"
    const m = time12.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i)
    if (!m) {
      // Try to parse already 24-hour style
      const parts = time12.split(":")
      if (parts.length >= 2) return parts[0].padStart(2, '0') + ':' + parts[1].padStart(2, '0')
      return ''
    }
    let hour = parseInt(m[1], 10)
    const minute = m[2]
    const period = m[3].toUpperCase()
    if (period === 'PM' && hour !== 12) hour += 12
    if (period === 'AM' && hour === 12) hour = 0
    return String(hour).padStart(2, '0') + ':' + minute
  }

  // Map page events to the Calendar component's expected shape
  const calendarEvents = events.map((e) => ({
    eventId: e.id,
    title: e.title,
    description: e.description || '',
    // Calendar expects ISO date strings YYYY-MM-DD
    createdDate: e.date.toISOString().split('T')[0],
    dueDate: e.date.toISOString().split('T')[0],
    dueTime: parse12HourTo24(e.time),
    createdTime: parse12HourTo24(e.time) || '00:00',
    userId: '' // page events don't include userId; set empty or provide an actual id if available
  }))

  return (
    <>
      <Calendar events={calendarEvents} />
    </>
  )
}

export default page
