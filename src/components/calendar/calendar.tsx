"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Search, Plus, Clock, Calendar as CalendarIcon, MapPin, Users, X, Edit, Trash2, AlertCircle, CheckCircle2 } from "lucide-react"
import api from '@/utils/api'
import { useAuth } from "@/contexts/AuthContext"
import toast, { Toaster } from 'react-hot-toast'

type ViewType = "month" | "week" | "day"

interface CalendarEvent {
  eventId: string
  title: string
  description?: string
  createdDate: string // LocalDate from backend (YYYY-MM-DD)
  dueDate: string // LocalDate from backend (YYYY-MM-DD)
  dueTime: string // LocalTime from backend (HH:mm)
  createdTime: string // LocalTime from backend (HH:mm)
  userId: string
}

interface ApiEvent extends CalendarEvent {} // ApiEvent now shares the same structure

// Notification helpers
// Enhanced notification helpers with beautiful styling and animations
const showSuccess = (message: string, details?: string) => {
  toast.custom((t) => (
    <div className={`${t.visible ? 'animate-enter scale-100 opacity-100' : 'animate-leave scale-95 opacity-0'} 
      transform transition-all duration-300 ease-in-out
      max-w-md w-full bg-gradient-to-r from-emerald-50 to-teal-50 
      shadow-lg rounded-xl pointer-events-auto border border-emerald-100/50`}
    >
      <div className="flex p-4">
        <div className="flex-shrink-0 pt-0.5">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-sm">
            <CheckCircle2 className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-base font-semibold text-emerald-900">{message}</p>
          {details && (
            <p className="mt-1 text-sm text-emerald-700 leading-relaxed opacity-90">
              {details}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-emerald-100 rounded-lg p-1.5 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-200 transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  ), {
    duration: 3000,
    position: 'top-right',
  });
};

const showError = (message: string, details?: string) => {
  toast.custom((t) => (
    <div className={`${t.visible ? 'animate-enter scale-100 opacity-100' : 'animate-leave scale-95 opacity-0'} 
      transform transition-all duration-300 ease-in-out
      max-w-md w-full bg-gradient-to-r from-rose-50 to-red-50 
      shadow-lg rounded-xl pointer-events-auto border border-rose-100/50`}
    >
      <div className="flex p-4">
        <div className="flex-shrink-0 pt-0.5">
          <div className="p-2 bg-gradient-to-br from-rose-500 to-red-500 rounded-lg shadow-sm">
            <AlertCircle className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-base font-semibold text-rose-900">{message}</p>
          {details && (
            <p className="mt-1 text-sm text-rose-700 leading-relaxed opacity-90">
              {details}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-rose-100 rounded-lg p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-200 transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  ), {
    duration: 5000,
    position: 'top-right',
  });
};

const showLoading = (message: string) => {
  return toast.custom((
    <div className="max-w-md w-full bg-gradient-to-r from-blue-50 to-indigo-50 
      shadow-lg rounded-xl pointer-events-auto border border-blue-100/50 p-4"
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-indigo-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {message}
          </p>
        </div>
      </div>
    </div>
  ), {
    duration: Infinity,
    position: 'top-right',
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
  getAllEvents: async (currentUser: { id: string } | null = null) => {
    try {
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }

      // Make sure we're using the correct endpoint with user context
      const response = await api.get('/api/v1/events', {
        headers: {
          'user-id': currentUser.id
        },
        params: {
          userId: currentUser.id
        }
      })
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
    userId?: string
  }, currentUser: { id: string } | null = null) => {
    if (!currentUser?.id) {
      throw new Error('User not authenticated');
    }

    // Initialize formattedData with default values and ensure userId is set
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
      userId: currentUser.id
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
        userId: currentUser?.id || ''
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
    userId: string
  }, currentUser: { id: string } | null = null) => {
    try {
      // Validate user authentication
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }
      
      // Ensure userId matches the authenticated user
      if (currentUser.id !== eventData.userId) {
        throw new Error('Unauthorized: User ID mismatch');
      }

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

      // Make API call with user ID
      const response = await api.put(`/api/v1/events/${eventId}`, {
        ...formattedData,
        userId: currentUser.id
      }, {
        headers: {
          'user-id': currentUser.id
        }
      })

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

  deleteEvent: async (eventId: string, currentUser: { id: string } | null = null) => {
    try {
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }

      const response = await api.delete(`/api/v1/events/${eventId}`, {
        data: { userId: currentUser.id }
      });
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
      if (!user?.id) {
        showError(
          'Authentication Required',
          'Please log in to view your events.'
        );
        return;
      }

      setLoading(true)
      console.log('Loading events...')
      const apiEvents: ApiEvent[] = await eventFunction.getAllEvents(user)
      const transformedEvents = apiEvents
        .map(transformApiEventToCalendarEvent)
        .filter(event => event.userId === user.id) // Only show user's events
      setEvents(transformedEvents)
      console.log('Loaded events:', transformedEvents)
    } catch (error: any) {
      console.error('Error loading events:', error)
      
      // More detailed error handling
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        showError(
          'Connection Error',
          'Unable to reach the server. Please check your internet connection and try again.'
        );
      } else if (error.response?.status === 404) {
        showError(
          'Service Unavailable',
          'The calendar service is currently unavailable. Please try again later.'
        );
      } else if (error.response?.status >= 500) {
        showError(
          'Server Error',
          'An unexpected error occurred on our servers. Our team has been notified and is working on it.'
        );
      } else if (error.response?.status === 403) {
        showError(
          'Access Denied',
          'You do not have permission to view these events. Please contact your administrator.'
        );
      } else if (error.response?.status === 401) {
        showError(
          'Authentication Required',
          'Please log in again to view your calendar events.'
        );
      } else {
        showError(
          'Calendar Error',
          `Unable to load events: ${error.message}`
        );
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
    // Enhanced input validation with detailed messages
    if (!newEvent.title?.trim()) {
      showError(
        'Title Required',
        'Please enter a descriptive title for your event to help you identify it later.'
      );
      return;
    }
    if (!newEvent.dueDate) {
      showError(
        'Date Required',
        'Please select the date when this event is scheduled to occur.'
      );
      return;
    }
    if (!newEvent.dueTime) {
      showError(
        'Time Required',
        'Please specify the time when this event will take place.'
      );
      return;
    }
    
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(newEvent.dueDate)) {
      showError(
        'Invalid Date Format',
        'The date format appears to be incorrect. Please use the date picker to select a valid date.'
      );
      return;
    }
    
    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(newEvent.dueTime)) {
      showError(
        'Invalid Time Format',
        'The time format appears to be incorrect. Please use the time picker to select a valid time.'
      );
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
      
      if (!user?.id) {
        throw new Error('User ID is required');
      }

      // Format the event data with proper time padding
      eventData = {
        title: newEvent.title.trim(),
        description: newEvent.description?.trim() || '',
        dueDate: newEvent.dueDate,
        dueTime: formatTimeString(newEvent.dueTime),
        createdDate: createdDate,
        createdTime: formatTimeString(createdTime),
        userId: user.id
      }

      console.log('Prepared event data:', JSON.stringify(eventData, null, 2))
      console.log('Time validation - dueTime:', newEvent.dueTime, 'createdTime:', createdTime)
      console.log('Date validation - dueDate:', newEvent.dueDate, 'createdDate:', createdDate)
      console.log('Validations passed, creating event...')
      
      if (!user) {
        throw new Error('You must be logged in to create events')
      }
      const loadingToast = showLoading('Creating event...');
      
      if (!user || !user.id) {
        showError(
          'Authentication Required',
          'Please log in to create events.'
        );
        return;
      }

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
    // Check for valid event and user
    if (!editingEvent) {
      showError('Error', 'No event selected for editing');
      return;
    }

    if (!user?.id) {
      showError(
        'Authentication Required',
        'Please log in to edit events.'
      );
      return;
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
      if (!user?.id) {
        throw new Error('User authentication required')
      }

      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(editingEvent.dueDate)) {
        throw new Error('Invalid date format. Please use the date picker.')
      }

      // Validate time format
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(editingEvent.dueTime)) {
        throw new Error('Invalid time format. Please use the time picker.')
      }

      // Create event data with user ID
      const eventData = {
        title: editingEvent.title.trim(),
        description: editingEvent.description?.trim() || '',
        dueDate: editingEvent.dueDate,
        dueTime: editingEvent.dueTime,
        userId: user.id  // Explicitly set the user ID
      }
      
      if (!user || !user.id) {
        showError(
          'Authentication Required',
          'Please log in to update events.'
        );
        return;
      }

      // Attempt to update the event
      const loadingToast = showLoading('Updating event...');
      await eventFunction.updateEvent(editingEvent.eventId, eventData, user)
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

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);

  const handleDeleteEvent = async (event: CalendarEvent) => {
    setEventToDelete(event);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      if (!user || !user.id) {
        showError(
          'Authentication Required',
          'Please log in to delete events.'
        );
        return;
      }

      setLoading(true);
      const loadingToast = showLoading('Deleting event...');
      await eventFunction.deleteEvent(eventToDelete.eventId, user);
      toast.dismiss(loadingToast);
      showSuccess('Event deleted successfully');
      setShowEventModal(false);
      setShowDeleteConfirm(false);
      setEventToDelete(null);
      await loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      showError('Failed to delete event. Please try again.');
    } finally {
      setLoading(false);
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
                className={`min-h-[100px] px-3 py-2 border-r border-b border-gray-200 last:border-r-0 transition-all duration-200 ${
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
                      className="text-xs px-2.5 py-1.5 rounded-md cursor-pointer bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 truncate shadow-sm group flex items-center gap-1.5"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-blue-600 transition-colors"></div>
                      <span className="truncate">{event.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md mt-1 font-medium hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                      +{dayEvents.length - 3} more events
                    </div>
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
        <div className="max-h-[500px] overflow-y-auto">
          <div className="grid grid-cols-8">
            {/* Time column */}
            <div className="border-r border-gray-200">
              {hours.map((hour) => (
                <div key={hour} className="h-12 p-2 border-b border-gray-100 text-xs text-gray-500">
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
                          className="text-xs px-2 py-1.5 rounded-md cursor-pointer bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 truncate shadow-sm group flex items-center gap-1.5"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-blue-600 transition-colors"></div>
                          <span className="truncate">{event.title}</span>
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
        <div className="max-h-[500px] overflow-y-auto">
          <div className="grid grid-cols-12">
            {/* Time column */}
            <div className="col-span-2 border-r border-gray-200">
              {hours.map((hour) => (
                <div key={hour} className="h-12 px-4 py-2 border-b border-gray-100 text-xs text-gray-500">
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
                  <div key={hour} className="h-12 p-2 border-b border-gray-100">
                    {hourEvents.map((event: CalendarEvent) => (
                      <div
                        key={event.eventId}
                        onClick={() => handleEventClick(event)}
                        className="p-2.5 rounded-md cursor-pointer bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 mb-1.5 shadow-sm group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-blue-600 transition-colors"></div>
                          <div className="font-medium truncate">{event.title}</div>
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
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-4">
        {/* Header */}
        <div className="mb-4">
          <div className="p-4">
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight mb-1">Calendar</h1>
            <p className="text-gray-500 text-sm">Plan, schedule, and manage your events efficiently</p>
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="mb-4 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-900">Event Details</h3>
                </div>
                <button 
                  onClick={() => setShowEventModal(false)} 
                  className="bg-gray-100 text-gray-500 p-2 rounded-lg flex items-center hover:bg-gray-200 hover:text-gray-700 transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

                <div className="space-y-4">
                {/* Title Section */}
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 rounded-lg p-4 border border-indigo-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <h4 className="font-medium text-gray-900 text-lg">{selectedEvent.title}</h4>
                  </div>
                </div>

                {/* Date & Time Section */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <CalendarIcon className="h-5 w-5 text-indigo-500" />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Due Date</span>
                      <span className="font-medium text-gray-900">{selectedEvent.dueDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <Clock className="h-5 w-5 text-indigo-500" />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Due Time</span>
                      <span className="font-medium text-gray-900">{selectedEvent.dueTime}</span>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                {selectedEvent.description && (
                  <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-indigo-500" />
                      <span className="text-sm font-medium text-gray-700">Description</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed pl-6">{selectedEvent.description}</p>
                  </div>
                )}                <div className="flex space-x-3 pt-4">
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
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && eventToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowDeleteConfirm(false)}></div>
            <div className="relative bg-white rounded-xl overflow-hidden shadow-xl border border-red-100 w-full max-w-md mx-4 z-[61]">
              {/* Header */}
              <div className="bg-gradient-to-r from-rose-500 to-red-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Trash2 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Confirm Deletion</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 bg-gradient-to-b from-rose-50 to-white">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-rose-100 rounded-full">
                    <AlertCircle className="h-5 w-5 text-rose-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-gray-900 mb-2">
                      Are you sure you want to delete this event?
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      This action will permanently remove "{eventToDelete.title}" from your calendar. 
                      This cannot be undone.
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                      rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                      focus:ring-gray-500 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-500 
                      to-red-600 rounded-lg hover:from-rose-600 hover:to-red-700 focus:outline-none 
                      focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200
                      flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEditModal && editingEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 mt-8">
            <div className="bg-white rounded-xl p-6 w-[650px] max-h-[80vh] mx-4 overflow-y-auto shadow-xl border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-900">Edit Event</h3>
                </div>
                <button 
                  onClick={() => setShowEditModal(false)} 
                  className="bg-gray-100 text-gray-500 p-2 rounded-lg flex items-center hover:bg-gray-200 hover:text-gray-700 transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Title</label>
                  <input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200"
                    placeholder="Enter event title"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea
                    value={editingEvent.description || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200"
                    rows={3}
                    placeholder="Add event description (optional)"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={editingEvent.dueDate}
                        onChange={(e) => setEditingEvent({ ...editingEvent, dueDate: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Time</label>
                    <div className="relative">
                      <input
                        type="time"
                        value={editingEvent.dueTime}
                        onChange={(e) => {
                          const formattedTime = formatTimeString(e.target.value);
                          setEditingEvent({ ...editingEvent, dueTime: formattedTime });
                        }}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200"
                        pattern="[0-2][0-9]:[0-5][0-9]"
                        placeholder="HH:mm"
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end items-center space-x-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-medium shadow-sm transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || !editingEvent.title || !editingEvent.dueDate || !editingEvent.dueTime}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Event Modal */}
        {showAddEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 mt-8">
            <div className="bg-white rounded-xl p-6 w-[650px] max-h-[80vh] mx-4 overflow-y-auto shadow-xl border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-900">Add New Event</h3>
                </div>
                <button 
                  onClick={() => setShowAddEvent(false)} 
                  className="bg-gray-100 text-gray-500 p-2 rounded-lg flex items-center hover:bg-gray-200 hover:text-gray-700 transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter event title"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    rows={3}
                    placeholder="Add event description (optional)"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={newEvent.dueDate}
                        onChange={(e) => setNewEvent({ ...newEvent, dueDate: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Time</label>
                    <div className="relative">
                      <input
                        type="time"
                        value={newEvent.dueTime}
                        onChange={(e) => {
                          const formattedTime = formatTimeString(e.target.value);
                          setNewEvent({ ...newEvent, dueTime: formattedTime });
                        }}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                        pattern="[0-2][0-9]:[0-5][0-9]"
                        placeholder="HH:mm"
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end items-center space-x-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowAddEvent(false)}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEvent}
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium shadow-sm transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || !newEvent.title || !newEvent.dueDate || !newEvent.dueTime}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add Event
                      </>
                    )}
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