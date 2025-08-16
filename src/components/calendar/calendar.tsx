"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Search, Plus, Clock, MapPin, Users, X, Edit, Trash2 } from "lucide-react"
import api from '@/utils/api'

type ViewType = "month" | "week" | "day"
type EventType = "meeting" | "standup" | "review" | "planning" | "demo" | "coffee" | "lunch" | "dinner"

interface CalendarEvent {
  eventId: string
  title: string
  description?: string
  createdDate: string // LocalDate from backend
  dueDate: string // LocalDate from backend
  dueTime: string // LocalTime from backend
  createdTime: string // LocalTime from backend
  userId: string
  // UI-specific properties
  time: string
  endTime?: string
  type: EventType
  color: string
  date: Date
  location?: string
  attendees?: string[]
}

interface ApiEvent {
  eventId: string
  title: string
  description?: string
  createdDate: string
  dueDate: string
  dueTime: string
  createdTime: string
  userId: string
}

const eventFunction = {
  getAllEvents: async () => {
    try {
      // Make sure we're using the correct port 8082
      console.log('Attempting to fetch events from:', `${api.defaults.baseURL || 'http://localhost:8082'}/api/v1/events`)
      const response = await api.get('/api/v1/events')
      console.log('Events Data:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching events:', error)
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      })
      throw error
    }
  },

  getEventById: async (eventId: string) => {
    try {
      const response = await api.get(`/api/v1/events/${eventId}`)
      console.log('Event Data:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching event:', error)
      throw error
    }
  },

  getEventsByDate: async (date: string) => {
    try {
      const response = await api.get(`/api/v1/events/date/${date}`)
      console.log('Events by Date:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching events by date:', error)
      throw error
    }
  },

  getEventsByDateRange: async (startDate: string, endDate: string) => {
    try {
      const response = await api.get(`/api/v1/events/range?startDate=${startDate}&endDate=${endDate}`)
      console.log('Events by Date Range:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching events by date range:', error)
      throw error
    }
  },

  createEvent: async (eventData: {
    title: string
    description?: string
    dueDate: string
    dueTime: string
  }) => {
    try {
      const currentDate = new Date()
      const formattedDate = currentDate.toISOString().split('T')[0] // YYYY-MM-DD
      const formattedTime = currentDate.toTimeString().split(' ')[0].substring(0, 5) // HH:MM
      
      const eventPayload = {
        title: eventData.title,
        description: eventData.description || '',
        createdDate: formattedDate,
        dueDate: eventData.dueDate,
        dueTime: eventData.dueTime,
        createdTime: formattedTime,
        userId: 'current-user-id' // Replace with actual user ID from auth context
      }
      
      const response = await api.post('/api/v1/events', eventPayload)
      console.log('Created Event:', response.data)
      return response.data
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  },

  updateEvent: async (eventId: string, eventData: {
    title: string
    description?: string
    dueDate: string
    dueTime: string
  }) => {
    try {
      const response = await api.put(`/api/v1/events/${eventId}`, eventData)
      console.log('Updated Event:', response.data)
      return response.data
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  },

  deleteEvent: async (eventId: string) => {
    try {
      const response = await api.delete(`/api/v1/events/${eventId}`)
      console.log('Deleted Event:', response.data)
      return response.data
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  },

  getEventsCount: async () => {
    try {
      const response = await api.get('/api/v1/events/count')
      console.log('Events Count:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching events count:', error)
      throw error
    }
  },

  getEventsCountByDate: async (date: string) => {
    try {
      const response = await api.get(`/api/v1/events/count/date/${date}`)
      console.log('Events Count by Date:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching events count by date:', error)
      throw error
    }
  }
}

// Helper function to transform API event to UI event
const transformApiEventToCalendarEvent = (apiEvent: ApiEvent): CalendarEvent => {
  // Convert time from HH:MM:SS to HH:MM AM/PM format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  // Generate color based on event type or title
  const generateColor = (title: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
      'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
    ]
    const hash = title.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    return colors[Math.abs(hash) % colors.length]
  }

  // Determine event type from title (basic heuristic)
  const determineEventType = (title: string): EventType => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('meeting')) return 'meeting'
    if (lowerTitle.includes('standup')) return 'standup'
    if (lowerTitle.includes('review')) return 'review'
    if (lowerTitle.includes('planning')) return 'planning'
    if (lowerTitle.includes('demo')) return 'demo'
    if (lowerTitle.includes('coffee')) return 'coffee'
    if (lowerTitle.includes('lunch')) return 'lunch'
    if (lowerTitle.includes('dinner')) return 'dinner'
    return 'meeting' // default
  }

  return {
    eventId: apiEvent.eventId,
    title: apiEvent.title,
    description: apiEvent.description,
    createdDate: apiEvent.createdDate,
    dueDate: apiEvent.dueDate,
    dueTime: apiEvent.dueTime,
    createdTime: apiEvent.createdTime,
    userId: apiEvent.userId,
    time: formatTime(apiEvent.dueTime),
    endTime: undefined, // Can be calculated or set based on duration
    type: determineEventType(apiEvent.title),
    color: generateColor(apiEvent.title),
    date: new Date(apiEvent.dueDate),
    location: undefined, // Not available in current API
    attendees: undefined // Not available in current API
  }
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<ViewType>("month")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [activeFilter, setActiveFilter] = useState("All events")
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
  })

  const today = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Load events on component mount
  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      console.log('Loading events...')
      const apiEvents: ApiEvent[] = await eventFunction.getAllEvents()
      const transformedEvents = apiEvents.map(transformApiEventToCalendarEvent)
      setEvents(transformedEvents)
      console.log('Loaded events:', transformedEvents)
    } catch (error: any) {
      console.error('Error loading events:', error)
      
      // More detailed error handling
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        alert('Network Error: Please check if your backend server is running on the correct port and CORS is configured.')
      } else if (error.response?.status === 404) {
        alert('API endpoint not found. Please check if the backend server is running.')
      } else if (error.response?.status >= 500) {
        alert('Server Error: Please check your backend server.')
      } else {
        alert(`Failed to load events: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const loadEventsByDateRange = async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true)
      const startDateStr = startDate.toISOString().split('T')[0]
      const endDateStr = endDate.toISOString().split('T')[0]
      const apiEvents: ApiEvent[] = await eventFunction.getEventsByDateRange(startDateStr, endDateStr)
      const transformedEvents = apiEvents.map(transformApiEventToCalendarEvent)
      setEvents(transformedEvents)
    } catch (error) {
      console.error('Error loading events by date range:', error)
      alert('Failed to load events. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddEvent = async () => {
    if (newEvent.title && newEvent.dueDate && newEvent.dueTime) {
      try {
        setLoading(true)
        await eventFunction.createEvent(newEvent)
        setShowAddEvent(false)
        setNewEvent({
          title: "",
          description: "",
          dueDate: "",
          dueTime: "",
        })
        // Reload events to show the new one
        await loadEvents()
      } catch (error) {
        console.error('Error adding event:', error)
        alert('Failed to add event. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleEditEvent = async (event: CalendarEvent) => {
    // Implementation for editing event
    console.log("Editing event:", event)
    // You can implement a similar modal for editing
  }

  const handleDeleteEvent = async (event: CalendarEvent) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        setLoading(true)
        await eventFunction.deleteEvent(event.eventId)
        setShowEventModal(false)
        // Reload events to reflect deletion
        await loadEvents()
      } catch (error) {
        console.error('Error deleting event:', error)
        alert('Failed to delete event. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add previous month's days
    const prevMonth = new Date(year, month - 1, 0)
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonth.getDate() - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonth.getDate() - i),
      })
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate: new Date(year, month, day),
      })
    }

    // Add next month's days to complete the grid
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, day),
      })
    }

    return days
  }

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday start
    startOfWeek.setDate(diff)

    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(currentDate.getMonth() - 1)
    } else {
      newDate.setMonth(currentDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setDate(currentDate.getDate() - 7)
    } else {
      newDate.setDate(currentDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setDate(currentDate.getDate() - 1)
    } else {
      newDate.setDate(currentDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowEventModal(true)
  }

  const getNavigationTitle = () => {
    switch (view) {
      case "month":
        return getMonthName(currentDate)
      case "week":
        const weekDays = getWeekDays(currentDate)
        const startDate = weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })
        const endDate = weekDays[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })
        return `${startDate} - ${endDate}, ${currentDate.getFullYear()}`
      case "day":
        return currentDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      default:
        return getMonthName(currentDate)
    }
  }

  const navigate = (direction: "prev" | "next") => {
    switch (view) {
      case "month":
        navigateMonth(direction)
        break
      case "week":
        navigateWeek(direction)
        break
      case "day":
        navigateDay(direction)
        break
    }
  }

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate)
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    return (
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {dayNames.map((day) => (
            <div key={day} className="p-3 text-sm font-medium text-gray-500 text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day.fullDate)
            const isCurrentDay = isToday(day.fullDate)

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b border-gray-100 ${
                  !day.isCurrentMonth ? "bg-gray-50" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm ${
                      !day.isCurrentMonth
                        ? "text-gray-400"
                        : isCurrentDay
                          ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-medium"
                          : "text-gray-900"
                    }`}
                  >
                    {day.date}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.eventId}
                      onClick={() => handleEventClick(event)}
                      className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${event.color} text-white truncate`}
                    >
                      {event.time} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 pl-1">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate)
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Week header */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-3 text-sm font-medium text-gray-500"></div>
          {weekDays.map((day, index) => (
            <div key={index} className="p-3 text-center border-l border-gray-200">
              <div className="text-sm font-medium text-gray-500">
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div
                className={`text-lg font-semibold mt-1 ${
                  isToday(day)
                    ? "bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                    : "text-gray-900"
                }`}
              >
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Week grid */}
        <div className="max-h-[600px] overflow-y-auto">
          <div className="grid grid-cols-8">
            {/* Time column */}
            <div className="border-r border-gray-200">
              {hours.map((hour) => (
                <div key={hour} className="h-16 p-2 border-b border-gray-100 text-xs text-gray-500">
                  {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map((day, dayIndex) => (
              <div key={dayIndex} className="border-r border-gray-200">
                {hours.map((hour) => {
                  const dayEvents = getEventsForDate(day).filter((event) => {
                    const eventHour = Number.parseInt(event.time.split(":")[0])
                    const isPM = event.time.includes("PM")
                    const adjustedHour =
                      isPM && eventHour !== 12 ? eventHour + 12 : eventHour === 12 && !isPM ? 0 : eventHour
                    return adjustedHour === hour
                  })

                  return (
                    <div key={hour} className="h-16 p-1 border-b border-gray-100 relative">
                      {dayEvents.map((event) => (
                        <div
                          key={event.eventId}
                          onClick={() => handleEventClick(event)}
                          className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${event.color} text-white truncate mb-1`}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const dayEvents = getEventsForDate(currentDate)

    return (
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Day header */}
        <div className="p-4 border-b border-gray-200">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-500">
              {currentDate.toLocaleDateString("en-US", { weekday: "long" })}
            </div>
            <div
              className={`text-2xl font-semibold mt-1 ${
                isToday(currentDate)
                  ? "bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto"
                  : "text-gray-900"
              }`}
            >
              {currentDate.getDate()}
            </div>
          </div>
        </div>

        {/* Day schedule */}
        <div className="max-h-[600px] overflow-y-auto">
          <div className="grid grid-cols-12">
            {/* Time column */}
            <div className="col-span-2 border-r border-gray-200">
              {hours.map((hour) => (
                <div key={hour} className="h-16 p-2 border-b border-gray-100 text-xs text-gray-500">
                  {hour === 0
                    ? "12:00 AM"
                    : hour < 12
                      ? `${hour}:00 AM`
                      : hour === 12
                        ? "12:00 PM"
                        : `${hour - 12}:00 PM`}
                </div>
              ))}
            </div>

            {/* Events column */}
            <div className="col-span-10">
              {hours.map((hour) => {
                const hourEvents = dayEvents.filter((event) => {
                  const eventHour = Number.parseInt(event.time.split(":")[0])
                  const isPM = event.time.includes("PM")
                  const adjustedHour =
                    isPM && eventHour !== 12 ? eventHour + 12 : eventHour === 12 && !isPM ? 0 : eventHour
                  return adjustedHour === hour
                })

                return (
                  <div key={hour} className="h-16 p-2 border-b border-gray-100">
                    {hourEvents.map((event) => (
                      <div
                        key={event.eventId}
                        onClick={() => handleEventClick(event)}
                        className={`p-2 rounded cursor-pointer hover:opacity-80 ${event.color} text-white mb-1`}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="text-xs opacity-90">
                          {event.time} {event.endTime && `- ${event.endTime}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-64"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">⌘K</div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button onClick={() => navigate("prev")} className="p-2 hover:bg-gray-100 rounded-md">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => navigate("next")} className="p-2 hover:bg-gray-100 rounded-md">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              Today
            </button>
            <h2 className="text-xl font-semibold text-gray-900">{getNavigationTitle()}</h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <select
                value={view}
                onChange={(e) => setView(e.target.value as ViewType)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <option value="month">Month view</option>
                <option value="week">Week view</option>
                <option value="day">Day view</option>
              </select>
            </div>
            <button
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
              onClick={() => setShowAddEvent(true)}
              disabled={loading}
            >
              <Plus className="mr-2 h-4 w-4" />
              {loading ? 'Loading...' : 'Add event'}
            </button>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="mb-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading events...</div>
            </div>
          ) : (
            <>
              {view === "month" && renderMonthView()}
              {view === "week" && renderWeekView()}
              {view === "day" && renderDayView()}
            </>
          )}
        </div>

        {/* Event Detail Modal */}
        {showEventModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
                <button onClick={() => setShowEventModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedEvent.title}</h4>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="mr-1 h-4 w-4" />
                    {selectedEvent.time}
                    {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
                  </div>
                </div>

                {selectedEvent.description && (
                  <div>
                    <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                  </div>
                )}

                {selectedEvent.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="mr-1 h-4 w-4" />
                    {selectedEvent.location}
                  </div>
                )}

                {selectedEvent.attendees && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="mr-1 h-4 w-4" />
                    {selectedEvent.attendees.join(", ")}
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={() => handleEditEvent(selectedEvent)}
                    className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={loading}
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteEvent(selectedEvent)}
                    className="flex items-center px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                    disabled={loading}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Event Modal */}
        {showAddEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 mt-8">
            <div className="bg-white rounded-lg p-6 w-[650px] max-h-[80vh] mx-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Event</h3>
                <button onClick={() => setShowAddEvent(false)} className="p-1 text-gray-400 hover:text-gray-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Event title"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Event description"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newEvent.dueDate}
                    onChange={(e) => setNewEvent({ ...newEvent, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Time</label>
                  <input
                    type="time"
                    value={newEvent.dueTime}
                    onChange={(e) => setNewEvent({ ...newEvent, dueTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddEvent(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEvent}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
                    disabled={loading || !newEvent.title || !newEvent.dueDate || !newEvent.dueTime}
                  >
                    {loading ? 'Adding...' : 'Add Event'}
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