"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Search, Plus, Clock, MapPin, Users, X, Edit, Trash2, AlertCircle, CheckCircle2 } from "lucide-react"
import api from '@/utils/api'
import { useAuth } from "@/contexts/AuthContext"
import toast, { Toaster } from 'react-hot-toast'

type ViewType = "month" | "week" | "day"

interface CalendarEvent {
  eventId: string
  title: string
  description?: string
  createdDate: string // LocalDate from backend
  dueDate: string // LocalDate from backend
  dueTime: string // LocalTime from backend
  createdTime: string // LocalTime from backend
  userId: string
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

// Notification helpers
const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
    icon: '✅',
    style: {
      background: '#10B981',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
    },
  });
};

const showError = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
    icon: '❌',
    style: {
      background: '#EF4444',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
    },
  });
};

const showLoading = (message: string) => {
  return toast.loading(message, {
    position: 'top-right',
    style: {
      background: '#3B82F6',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
    },
  });
};

// Helper to format time as HH:mm
function formatTimeString(time: string): string {
  if (!time) return '';
  const parts = time.split(":");
  if (parts.length >= 2) {
    // Take just hours and minutes, ensure they are padded
    return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
  }
  return time; // fallback
}

const eventFunction = {
  getAllEvents: async () => {
    try {
      // Make sure we're using the correct endpoint
      const response = await api.get('/api/v1/events')
      console.log('Events Data:', response.data)
      
      // Validate response data
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: expected an array of events')
      }
      
      return response.data
    } catch (error) {
      console.error('Error fetching events:', error)
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          status: (error as any).response?.status,
          statusText: (error as any).response?.statusText,
          data: (error as any).response?.data,
          url: (error as any).config?.url,
          baseURL: (error as any).config?.baseURL
        })
      }
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
    createdDate: string
    createdTime: string
    userId: string
  }, currentUser: { id: string } | null = null) => {
    // Initialize formattedData with default values
    let formattedData: {
      title: string
      description: string
      dueDate: string
      dueTime: string
      createdDate: string
      createdTime: string
      userId: string
    } = {
      title: '',
      description: '',
      dueDate: '',
      dueTime: '',
      createdDate: '',
      createdTime: '',
      userId: ''
    }

    try {
      // Validate the input data
      if (!eventData.title || !eventData.dueDate || !eventData.dueTime) {
        throw new Error('Missing required fields: title, dueDate, or dueTime')
      }

      // Format dates to ensure they match exactly what the server expects
      formattedData = {
        title: eventData.title.trim(),
        description: eventData.description?.trim() || '',
        dueDate: eventData.dueDate,
        dueTime: eventData.dueTime,
        createdDate: eventData.createdDate,
        createdTime: eventData.createdTime,
        userId: currentUser?.id || eventData.userId
      }

      // Validate date formats
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      const timeRegex = /^([0-1]\d|2[0-3]):[0-5]\d$/

      if (!dateRegex.test(formattedData.dueDate) || !dateRegex.test(formattedData.createdDate)) {
        throw new Error('Invalid date format. Expected YYYY-MM-DD')
      }

      // Format and validate times
      formattedData.dueTime = formatTimeString(formattedData.dueTime)
      formattedData.createdTime = formatTimeString(formattedData.createdTime)

      if (!timeRegex.test(formattedData.dueTime) || !timeRegex.test(formattedData.createdTime)) {
        throw new Error('Invalid time format. Expected HH:mm')
      }

      // Make the API call
      console.log('Making API call with data:', JSON.stringify(formattedData, null, 2))
      const response = await api.post('/api/v1/events', formattedData)

      // Validate the response
      if (!response.data) {
        throw new Error('No data received from server')
      }

      return response.data
    } catch (error: any) {
      console.error('Event creation error:', {
        error,
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        serverError: error.response?.data,
        requestData: formattedData,
        stack: error.stack
      })

      // Throw a user-friendly error
      if (error.response?.status === 400) {
        const serverMessage = error.response?.data?.message || error.response?.data || 'Invalid event data'
        throw new Error(`Bad Request: ${serverMessage}`)
      } else if (error.response?.status === 401) {
        throw new Error('You must be logged in to create events.')
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to create events.')
      } else if (error.response?.status === 500) {
        const serverMessage = error.response?.data?.message || error.response?.data || 'Internal server error'
        throw new Error(`Server error: ${serverMessage}`)
      }

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
      // Validate input
      if (!eventId) {
        throw new Error('Event ID is required')
      }
      if (!eventData.title || !eventData.dueDate || !eventData.dueTime) {
        throw new Error('Missing required fields: title, dueDate, or dueTime')
      }

      // Format time before creating formatted data
      const formattedTime = formatTimeString(eventData.dueTime);

      // Format data
      const formattedData = {
        title: eventData.title.trim(),
        description: eventData.description?.trim() || '',
        dueDate: eventData.dueDate,
        dueTime: formattedTime
      }

      // Validate date formats
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      const timeRegex = /^([0-1]\d|2[0-3]):[0-5]\d$/

      if (!dateRegex.test(formattedData.dueDate)) {
        throw new Error('Invalid date format. Expected YYYY-MM-DD')
      }

      if (!timeRegex.test(formattedData.dueTime)) {
        throw new Error('Invalid time format. Expected HH:mm')
      }

      // Make API call
      const response = await api.put(`/api/v1/events/${eventId}`, formattedData)

      // Validate response
      if (!response.data) {
        throw new Error('No data received from server')
      }

      return response.data
    } catch (error: any) {
      console.error('Event update error:', {
        error,
        eventId,
        requestData: eventData,
        status: error.response?.status,
        serverError: error.response?.data
      })

      // Throw user-friendly errors
      if (error.response?.status === 404) {
        throw new Error('Event not found')
      } else if (error.response?.status === 400) {
        throw new Error('Invalid event data. Please check all fields.')
      } else if (error.response?.status === 401) {
        throw new Error('You must be logged in to update events.')
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to update this event.')
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.')
      }

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
  // Transform API event to Calendar event
  return {
    eventId: apiEvent.eventId,
    title: apiEvent.title,
    description: apiEvent.description,
    createdDate: apiEvent.createdDate,
    dueDate: apiEvent.dueDate,
    dueTime: apiEvent.dueTime,
    createdTime: apiEvent.createdTime,
    userId: apiEvent.userId
  }
}

export default function Calendar() {
  const { user } = useAuth()
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<ViewType>("month")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [activeFilter, setActiveFilter] = useState("All events")
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  interface NewEventState {
    title: string;
    description: string;
    dueDate: string;
    dueTime: string;
  }

  const [newEvent, setNewEvent] = useState<NewEventState>({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
  })

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
    // Input validation
    if (!newEvent.title?.trim()) {
      showError('Please enter a title for the event');
      return;
    }
    if (!newEvent.dueDate) {
      showError('Please select a due date');
      return;
    }
    if (!newEvent.dueTime) {
      showError('Please select a due time');
      return;
    }

    let eventData: any;
    try {
      setLoading(true)
      console.log('Starting event creation process...')
      
      // Get current date and time in proper format
      const now = new Date()
      const createdDate = now.toISOString().split('T')[0] // YYYY-MM-DD format
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const createdTime = `${hours}:${minutes}` // HH:mm format
      
      // Validate date formats
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      const timeRegex = /^([0-1]\d|2[0-3]):[0-5]\d$/
      
      if (!dateRegex.test(newEvent.dueDate)) {
        throw new Error(`Invalid due date format: ${newEvent.dueDate}. Expected YYYY-MM-DD`)
      }
      if (!timeRegex.test(newEvent.dueTime)) {
        throw new Error(`Invalid due time format: ${newEvent.dueTime}. Expected HH:mm`)
      }
      
      // Format the event data with proper time padding
      eventData = {
        title: newEvent.title.trim(),
        description: newEvent.description?.trim() || '',
        dueDate: newEvent.dueDate,
        dueTime: formatTimeString(newEvent.dueTime),
        createdDate: createdDate,
        createdTime: formatTimeString(createdTime),
        userId: "00000000-0000-0000-0000-000000000001" // Simple test UUID
      }

      console.log('Prepared event data:', JSON.stringify(eventData, null, 2))
      console.log('Time validation - dueTime:', newEvent.dueTime, 'createdTime:', createdTime)
      console.log('Date validation - dueDate:', newEvent.dueDate, 'createdDate:', createdDate)
      console.log('Validations passed, creating event...')
      
      if (!user) {
        throw new Error('You must be logged in to create events')
      }
      const loadingToast = showLoading('Creating event...');
      
      const result = await eventFunction.createEvent(eventData, user)
      toast.dismiss(loadingToast);
      showSuccess('Event created successfully!');
      
      setShowAddEvent(false)
      setNewEvent({
        title: "",
        description: "",
        dueDate: "",
        dueTime: "",
      })
      
      await loadEvents()
      
    } catch (error: any) {
      console.error('Event creation failed:', {
        error: error,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        requestData: eventData,
        stack: error.stack
      })
      
      let errorMessage = 'Failed to add event'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data) {
        errorMessage = JSON.stringify(error.response.data)
      } else if (error.message) {
        errorMessage = error.message
      }
      
      showError(errorMessage)
      console.error('Detailed error:', error)
      
    } finally {
      setLoading(false)
    }
  }

  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const handleEditEvent = async (event: CalendarEvent) => {
    try {
      // Validate the event data before setting it for editing
      if (!event.eventId || !event.title || !event.dueDate || !event.dueTime) {
        throw new Error('Invalid event data')
      }
      
      // Format the time before setting it in the edit form
      const formattedEvent = {
        ...event,
        dueTime: formatTimeString(event.dueTime)
      };
      
      setEditingEvent(formattedEvent)
      setShowEditModal(true)
      setShowEventModal(false)
    } catch (error) {
      console.error('Error preparing event for edit:', error)
      alert('Could not edit this event. Please try again.')
    }
  }

  const handleSaveEdit = async () => {
    if (!editingEvent) {
      alert('No event selected for editing')
      return
    }

    try {
      setLoading(true)
      
      // Validate required fields
      if (!editingEvent.title?.trim()) {
        throw new Error('Please enter a title for the event')
      }
      if (!editingEvent.dueDate) {
        throw new Error('Please select a due date')
      }
      if (!editingEvent.dueTime) {
        throw new Error('Please select a due time')
      }

      const eventData = {
        title: editingEvent.title.trim(),
        description: editingEvent.description?.trim() || '',
        dueDate: editingEvent.dueDate,
        dueTime: editingEvent.dueTime,
      }
      
      // Attempt to update the event
      const loadingToast = showLoading('Updating event...');
      await eventFunction.updateEvent(editingEvent.eventId, eventData)
      toast.dismiss(loadingToast);
      showSuccess('Event updated successfully!');
      
      // If successful, close modal and refresh
      setShowEditModal(false)
      setEditingEvent(null)
      await loadEvents()
    } catch (error: any) {
      console.error('Error updating event:', error)
      
      // Show user-friendly error message
      let errorMessage = 'Failed to update event'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async (event: CalendarEvent) => {
    const confirmDelete = () => {
      return new Promise((resolve) => {
        toast((t) => (
          <div className="flex flex-col gap-2">
            <p className="font-medium text-gray-900">Delete Event?</p>
            <p className="text-sm text-gray-600">This action cannot be undone.</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ), {
          duration: Infinity,
          position: 'top-center',
        });
      });
    };

    const confirmed = await confirmDelete();
    if (confirmed) {
      try {
        setLoading(true);
        const loadingToast = showLoading('Deleting event...');
        await eventFunction.deleteEvent(event.eventId);
        toast.dismiss(loadingToast);
        showSuccess('Event deleted successfully');
        setShowEventModal(false);
        await loadEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        showError('Failed to delete event. Please try again.');
      } finally {
        setLoading(false);
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
      (event: CalendarEvent) => {
        const eventDate = new Date(event.dueDate)
        return eventDate.getDate() === date.getDate() &&
               eventDate.getMonth() === date.getMonth() &&
               eventDate.getFullYear() === date.getFullYear()
      }
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-slate-50">
          {dayNames.map((day) => (
            <div key={day} className="py-3 text-xs font-semibold text-gray-600 text-center border-r border-gray-200 last:border-r-0 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day.fullDate)
            const isCurrentDay = isToday(day.fullDate)
            const hasEvents = dayEvents.length > 0

            return (
              <div
                key={index}
                className={`min-h-[130px] p-3 border-r border-b border-gray-200 last:border-r-0 transition-all duration-200 ${
                  !day.isCurrentMonth ? "bg-slate-50" : "bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-sm font-medium px-2.5 py-1 rounded-full transition-all ${
                      !day.isCurrentMonth
                        ? "text-gray-400"
                        : isCurrentDay
                          ? "bg-blue-600 text-white shadow-sm"
                          : hasEvents
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700"
                    }`}
                  >
                    {day.date}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {dayEvents.slice(0, 3).map((event: CalendarEvent) => (
                    <div
                      key={event.eventId}
                      onClick={() => handleEventClick(event)}
                      className="text-xs px-2.5 py-1.5 rounded-md cursor-pointer bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-all duration-200 truncate shadow-sm"
                    >
                      <span className="font-medium">{event.dueTime}</span> {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-blue-600 pl-2 font-medium mt-1">+{dayEvents.length - 3} more events</div>
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
      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/80 shadow-sm hover:bg-white transition-all duration-300">
        {/* Week header */}
        <div className="grid grid-cols-8 border-b border-gray-200/80">
          <div className="p-3 text-sm font-medium text-gray-500"></div>
          {weekDays.map((day, index) => (
            <div key={index} className="p-3 text-center border-l border-gray-200/80 hover:bg-blue-50/50 transition-colors duration-200">
              <div className="text-sm font-medium text-gray-500">
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div
                className={`text-lg font-semibold mt-1 ${
                  isToday(day)
                    ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto shadow-sm"
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
                  const dayEvents = getEventsForDate(day).filter((event: CalendarEvent) => {
                    const eventHour = Number.parseInt(event.dueTime.split(":")[0])
                    return eventHour === hour
                  })

                  return (
                    <div key={hour} className="h-16 p-1 border-b border-gray-100 relative">
                      {dayEvents.map((event: CalendarEvent) => (
                        <div
                          key={event.eventId}
                          onClick={() => handleEventClick(event)}
                          className="text-xs p-1 rounded cursor-pointer hover:opacity-80 bg-blue-500 text-white truncate mb-1"
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
      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/80 shadow-sm hover:bg-white transition-all duration-300">
        {/* Day header */}
        <div className="p-4 border-b border-gray-200/80">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-500">
              {currentDate.toLocaleDateString("en-US", { weekday: "long" })}
            </div>
            <div
              className={`text-2xl font-semibold mt-1 ${
                isToday(currentDate)
                  ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto shadow-md"
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
                const hourEvents = dayEvents.filter((event: CalendarEvent) => {
                  const eventHour = Number.parseInt(event.dueTime.split(":")[0])
                  return eventHour === hour
                })

                return (
                  <div key={hour} className="h-16 p-2 border-b border-gray-100">
                    {hourEvents.map((event: CalendarEvent) => (
                      <div
                        key={event.eventId}
                        onClick={() => handleEventClick(event)}
                        className="p-2 rounded cursor-pointer hover:opacity-80 bg-blue-500 text-white mb-1"
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="text-xs opacity-90">
                          {event.dueTime}
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
    <div className="flex-1 overflow-auto bg-slate-50">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight mb-1">Calendar</h1>
            <p className="text-gray-500 text-sm">Plan, schedule, and manage your events efficiently</p>
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="mb-6 flex items-center justify-between bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => navigate("prev")} 
                className="p-2.5 bg-primary text-white rounded-lg flex items-center hover:bg-primary/90 transition-all duration-200 transform hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                onClick={() => navigate("next")} 
                className="p-2.5 bg-primary text-white rounded-lg flex items-center hover:bg-primary/90 transition-all duration-200 transform hover:scale-105"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg flex items-center hover:bg-primary/90 transition-all duration-200 transform hover:scale-105"
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
                className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer bg-white shadow-sm"
              >
                <option value="month">Month view</option>
                <option value="week">Week view</option>
                <option value="day">Day view</option>
              </select>
            </div>
            <button
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-primary/90 transition-all duration-200 transform hover:scale-105"
              onClick={() => setShowAddEvent(true)}
              disabled={loading}
            >
              <Plus className="h-4 w-4" />
              {loading ? 'Loading...' : 'New Event'}
            </button>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="mb-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin"></div>
              <div className="text-gray-500 font-medium">Loading events...</div>
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
                <button onClick={() => setShowEventModal(false)} className="bg-gray-500 text-white p-1.5 rounded-lg flex items-center hover:bg-gray-600 transition-all duration-200 transform hover:scale-105">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedEvent.title}</h4>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="mr-1 h-4 w-4" />
                    {selectedEvent.dueTime}
                  </div>
                </div>

                {selectedEvent.description && (
                  <div>
                    <p className="text-sm text-gray-600">{selectedEvent.description}</p>
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

        {/* Edit Event Modal */}
        {showEditModal && editingEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 mt-8">
            <div className="bg-white rounded-lg p-6 w-[650px] max-h-[80vh] mx-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit Event</h3>
                <button onClick={() => setShowEditModal(false)} className="bg-gray-500 text-white p-1.5 rounded-lg flex items-center hover:bg-gray-600 transition-all duration-200 transform hover:scale-105">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Event title"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editingEvent.description || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
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
                    value={editingEvent.dueDate}
                    onChange={(e) => setEditingEvent({ ...editingEvent, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Time</label>
                  <input
                    type="time"
                    value={editingEvent.dueTime}
                    onChange={(e) => {
                      const formattedTime = formatTimeString(e.target.value);
                      setEditingEvent({ ...editingEvent, dueTime: formattedTime });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    pattern="[0-2][0-9]:[0-5][0-9]"
                    placeholder="HH:mm"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-600 transition-all duration-200 transform hover:scale-105"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-primary/90 transition-all duration-200 transform hover:scale-105"
                    disabled={loading || !editingEvent.title || !editingEvent.dueDate || !editingEvent.dueTime}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
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
                <button onClick={() => setShowAddEvent(false)} className="bg-gray-500 text-white p-1.5 rounded-lg flex items-center hover:bg-gray-600 transition-all duration-200 transform hover:scale-105">
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
                    onChange={(e) => {
                      const formattedTime = formatTimeString(e.target.value);
                      setNewEvent({ ...newEvent, dueTime: formattedTime });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    pattern="[0-2][0-9]:[0-5][0-9]"
                    placeholder="HH:mm"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddEvent(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-600 transition-all duration-200 transform hover:scale-105"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEvent}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-primary/90 transition-all duration-200 transform hover:scale-105"
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