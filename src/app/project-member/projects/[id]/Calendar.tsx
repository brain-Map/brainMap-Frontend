import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, X, Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import api from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';

interface Event {
  eventId: string;
  projectId: string;
  title: string;
  description: string;
  createDate: string;
  dueDate: string;
  userId: string;
  createdTime: string;
}

interface CalendarEventApi {
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  userId: string;
}

const CalendarData = {
  getCalendarEvents: async (projectId: string) => {
    try {
      const response = await api.get(`/project-member/projects/get-events/${projectId}`);
      console.log('Calendar Data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar:', error);
      throw error;
    }
  },

  createEvent: async (Event: CalendarEventApi) => {
    try {
      const response = await api.post(`/project-member/projects/create-events`, Event);
      console.log('Created Event:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  deleteEvent: async (eventId: string) => {
    try {
      const response = await api.delete(`/project-member/projects/delete-events/${eventId}`);
      console.log('Deleted Event:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
};

export default function EventCalendarApp() {
  const user = useAuth().user;
  const params = useParams();
  const projectId = params?.id as string;

  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    dueTime: '',
    description: ''
  });

  useEffect(() => {
    if (projectId) {
      loadEvents();
    }
  }, [projectId]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await CalendarData.getCalendarEvents(projectId);
      if (data && Array.isArray(data)) {
        // ✅ Sort by dueDate ascending before setting
        const sortedEvents = data.sort(
          (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
        setEvents(sortedEvents);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getEventsForDate = (date: string) =>
    events.filter(event => event.dueDate === date);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

  const handleNextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const handleCreateEvent = async () => {
    if (!formData.title || !formData.dueDate || !formData.dueTime || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const userId = user?.id || '';
      const eventData: CalendarEventApi = {
        projectId,
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        dueTime: formData.dueTime,
        userId
      };

      console.log('Creating event with data:', eventData);
      await CalendarData.createEvent(eventData);
      await loadEvents();

      setFormData({ title: '', dueDate: '', dueTime: '', description: '' });
      setShowCreateModal(false);
      alert('Event created successfully!');
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    console.log('Deleting event with ID:', eventId);
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      setLoading(true);
      await CalendarData.deleteEvent(eventId);
      await loadEvents();
      setSelectedEvent(null);
      alert('Event deleted successfully!');
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const days = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = getEventsForDate(dateString);
    const isToday =
      dateString === new Date().toISOString().split('T')[0];

    days.push(
      <div
        key={day}
        className={`h-24 border border-gray-200 p-2 hover:bg-gray-50 transition-colors ${
          isToday ? 'bg-blue-50' : 'bg-white'
        }`}
      >
        <div
          className={`text-sm font-semibold mb-1 ${
            isToday ? 'text-blue-600' : 'text-gray-700'
          }`}
        >
          {day}
        </div>
        <div className="space-y-1">
          {dayEvents.slice(0, 2).map(event => (
            <div
              key={event.eventId}
              onClick={() => setSelectedEvent(event)}
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded cursor-pointer hover:bg-blue-600 truncate"
            >
              {event.createdTime} - {event.title}
            </div>
          ))}
          {dayEvents.length > 2 && (
            <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto">
        <div className="rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Event Calendar</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Create Event
            </button>
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-6 max-w-7xl mx-auto">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-2xl font-semibold text-gray-700">{formatDate(currentDate)}</h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="mb-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-7 gap-0 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0 border border-gray-200">{days}</div>
          </div>

          {/* Event List - Sorted by dueDate */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {events.length > 0 ? (
                events.map(event => (
                  <div
                    key={event.eventId}
                    onClick={() => setSelectedEvent(event)}
                    className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{event.title}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar size={16} />
                            {new Date(event.dueDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={16} />
                            {event.createdTime}
                          </span>
                          {/* <span className="flex items-center gap-1">
                            <User size={16} />
                            {event.userId}
                          </span> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No upcoming events.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{selectedEvent.title}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteEvent(selectedEvent.eventId)}
                  disabled={loading}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete Event"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar size={20} className="text-blue-600" />
                <span>
                  {new Date(selectedEvent.dueDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Clock size={20} className="text-blue-600" />
                <span>{selectedEvent.createdTime}</span>
              </div>
              {/* <div className="flex items-center gap-3 text-gray-700">
                <User size={20} className="text-blue-600" />
                <span>User: {selectedEvent.userId}</span>
              </div> */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                <p className="text-gray-600">{selectedEvent.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Create New Event</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter event title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={formData.dueTime}
                    onChange={e => setFormData({ ...formData, dueTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Enter event description"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateEvent}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Event'}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
