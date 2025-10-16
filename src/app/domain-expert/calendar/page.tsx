"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Search, Plus, Clock, MapPin, Users, X, Edit, Trash2 } from "lucide-react"
import Calendar from "@/components/calendar/calendar"


// export default function CalendarPage() {
//   const [currentDate, setCurrentDate] = useState(new Date())
//   const [view, setView] = useState<ViewType>("month")
//   const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
//   const [showEventModal, setShowEventModal] = useState(false)
//   const [activeFilter, setActiveFilter] = useState("All events")
//   const [showAddEvent, setShowAddEvent] = useState(false)
//   const [newEvent, setNewEvent] = useState({
//     title: "",
//     description: "",
//     date: "",
//     startTime: "",
//     endTime: "",
//     type: "meeting" as EventType,
//     participant: "",
//     location: "",
//     attendees: [] as string[],
//   })

//   const today = new Date()
//   const currentMonth = currentDate.getMonth()
//   const currentYear = currentDate.getFullYear()

//   // Sample events data
//   const events: CalendarEvent[] = [
//     {
//       id: "1",
//       title: "Monday standup",
//       time: "9:00 AM",
//       endTime: "9:30 AM",
//       type: "standup",
//       color: "bg-blue-500",
//       date: new Date(2025, 6, 6),
//       description: "Weekly team standup meeting",
//       location: "Conference Room A",
//       attendees: ["Team Lead", "Developers"],
//     },
//     {
//       id: "2",
//       title: "One-on-one w...",
//       time: "10:00 AM",
//       endTime: "10:30 AM",
//       type: "meeting",
//       color: "bg-red-500",
//       date: new Date(2025, 6, 2),
//       description: "One-on-one meeting with manager",
//       location: "Office",
//     },
//     {
//       id: "3",
//       title: "Friday standup",
//       time: "9:00 AM",
//       endTime: "9:30 AM",
//       type: "standup",
//       color: "bg-blue-500",
//       date: new Date(2025, 6, 3),
//     },
//     {
//       id: "4",
//       title: "House Inspect...",
//       time: "10:30 AM",
//       endTime: "11:30 AM",
//       type: "meeting",
//       color: "bg-orange-500",
//       date: new Date(2025, 6, 4),
//     },
//     {
//       id: "5",
//       title: "Coffee with client",
//       time: "1:00 AM",
//       endTime: "2:00 PM",
//       type: "coffee",
//       color: "bg-green-500",
//       date: new Date(2025, 6, 6),
//     },
//     {
//       id: "6",
//       title: "All-hands meet...",
//       time: "4:00 PM",
//       endTime: "5:00 PM",
//       type: "meeting",
//       color: "bg-purple-500",
//       date: new Date(2025, 6, 6),
//     },
//     {
//       id: "7",
//       title: "Dinner with C...",
//       time: "6:00 PM",
//       endTime: "8:00 PM",
//       type: "dinner",
//       color: "bg-green-500",
//       date: new Date(2025, 6, 6),
//     },
//     {
//       id: "8",
//       title: "One-on-one w...",
//       time: "10:00 AM",
//       endTime: "10:30 AM",
//       type: "meeting",
//       color: "bg-red-500",
//       date: new Date(2025, 6, 9),
//     },
//     {
//       id: "9",
//       title: "Deep work",
//       time: "2:00 PM",
//       endTime: "4:00 PM",
//       type: "planning",
//       color: "bg-blue-500",
//       date: new Date(2025, 6, 9),
//     },
//     {
//       id: "10",
//       title: "Lunch with...",
//       time: "12:00 PM",
//       endTime: "1:00 PM",
//       type: "lunch",
//       color: "bg-green-500",
//       date: new Date(2025, 6, 9),
//     },
//   ]

//   const getMonthName = (date: Date) => {
//     return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
//   }

//   const getDaysInMonth = (date: Date) => {
//     const year = date.getFullYear()
//     const month = date.getMonth()
//     const firstDay = new Date(year, month, 1)
//     const lastDay = new Date(year, month + 1, 0)
//     const daysInMonth = lastDay.getDate()
//     const startingDayOfWeek = firstDay.getDay()

//     const days = []

//     // Add previous month's days
//     const prevMonth = new Date(year, month - 1, 0)
//     for (let i = startingDayOfWeek - 1; i >= 0; i--) {
//       days.push({
//         date: prevMonth.getDate() - i,
//         isCurrentMonth: false,
//         fullDate: new Date(year, month - 1, prevMonth.getDate() - i),
//       })
//     }

//     // Add current month's days
//     for (let day = 1; day <= daysInMonth; day++) {
//       days.push({
//         date: day,
//         isCurrentMonth: true,
//         fullDate: new Date(year, month, day),
//       })
//     }

//     // Add next month's days to complete the grid
//     const remainingDays = 42 - days.length
//     for (let day = 1; day <= remainingDays; day++) {
//       days.push({
//         date: day,
//         isCurrentMonth: false,
//         fullDate: new Date(year, month + 1, day),
//       })
//     }

//     return days
//   }

//   const getWeekDays = (date: Date) => {
//     const startOfWeek = new Date(date)
//     const day = startOfWeek.getDay()
//     const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday start
//     startOfWeek.setDate(diff)

//     const days = []
//     for (let i = 0; i < 7; i++) {
//       const day = new Date(startOfWeek)
//       day.setDate(startOfWeek.getDate() + i)
//       days.push(day)
//     }
//     return days
//   }

//   const getEventsForDate = (date: Date) => {
//     return events.filter(
//       (event) =>
//         event.date.getDate() === date.getDate() &&
//         event.date.getMonth() === date.getMonth() &&
//         event.date.getFullYear() === date.getFullYear(),
//     )
//   }

//   const navigateMonth = (direction: "prev" | "next") => {
//     const newDate = new Date(currentDate)
//     if (direction === "prev") {
//       newDate.setMonth(currentDate.getMonth() - 1)
//     } else {
//       newDate.setMonth(currentDate.getMonth() + 1)
//     }
//     setCurrentDate(newDate)
//   }

//   const navigateWeek = (direction: "prev" | "next") => {
//     const newDate = new Date(currentDate)
//     if (direction === "prev") {
//       newDate.setDate(currentDate.getDate() - 7)
//     } else {
//       newDate.setDate(currentDate.getDate() + 7)
//     }
//     setCurrentDate(newDate)
//   }

//   const navigateDay = (direction: "prev" | "next") => {
//     const newDate = new Date(currentDate)
//     if (direction === "prev") {
//       newDate.setDate(currentDate.getDate() - 1)
//     } else {
//       newDate.setDate(currentDate.getDate() + 1)
//     }
//     setCurrentDate(newDate)
//   }

//   const goToToday = () => {
//     setCurrentDate(new Date())
//   }

//   const isToday = (date: Date) => {
//     return (
//       date.getDate() === today.getDate() &&
//       date.getMonth() === today.getMonth() &&
//       date.getFullYear() === today.getFullYear()
//     )
//   }

//   const handleEventClick = (event: CalendarEvent) => {
//     setSelectedEvent(event)
//     setShowEventModal(true)
//   }

//   const getNavigationTitle = () => {
//     switch (view) {
//       case "month":
//         return getMonthName(currentDate)
//       case "week":
//         const weekDays = getWeekDays(currentDate)
//         const startDate = weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })
//         const endDate = weekDays[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })
//         return `${startDate} - ${endDate}, ${currentDate.getFullYear()}`
//       case "day":
//         return currentDate.toLocaleDateString("en-US", {
//           weekday: "long",
//           month: "long",
//           day: "numeric",
//           year: "numeric",
//         })
//       default:
//         return getMonthName(currentDate)
//     }
//   }

//   const navigate = (direction: "prev" | "next") => {
//     switch (view) {
//       case "month":
//         navigateMonth(direction)
//         break
//       case "week":
//         navigateWeek(direction)
//         break
//       case "day":
//         navigateDay(direction)
//         break
//     }
//   }

//   const renderMonthView = () => {
//     const days = getDaysInMonth(currentDate)
//     const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

//     return (
//       <div className="bg-white rounded-lg border border-gray-200">
//         {/* Day headers */}
//         <div className="grid grid-cols-7 border-b border-gray-200">
//           {dayNames.map((day) => (
//             <div key={day} className="p-3 text-sm font-medium text-gray-500 text-center">
//               {day}
//             </div>
//           ))}
//         </div>

//         {/* Calendar grid */}
//         <div className="grid grid-cols-7">
//           {days.map((day, index) => {
//             const dayEvents = getEventsForDate(day.fullDate)
//             const isCurrentDay = isToday(day.fullDate)

//             return (
//               <div
//                 key={index}
//                 className={`min-h-[120px] p-2 border-r border-b border-gray-100 ${
//                   !day.isCurrentMonth ? "bg-gray-50" : "bg-white"
//                 }`}
//               >
//                 <div className="flex items-center justify-between mb-1">
//                   <span
//                     className={`text-sm ${
//                       !day.isCurrentMonth
//                         ? "text-gray-400"
//                         : isCurrentDay
//                           ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-medium"
//                           : "text-gray-900"
//                     }`}
//                   >
//                     {day.date}
//                   </span>
//                 </div>
//                 <div className="space-y-1">
//                   {dayEvents.slice(0, 3).map((event) => (
//                     <div
//                       key={event.id}
//                       onClick={() => handleEventClick(event)}
//                       className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${event.color} text-white truncate`}
//                     >
//                       {event.time} {event.title}
//                     </div>
//                   ))}
//                   {dayEvents.length > 3 && (
//                     <div className="text-xs text-gray-500 pl-1">+{dayEvents.length - 3} more</div>
//                   )}
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </div>
//     )
//   }

//   const renderWeekView = () => {
//     const weekDays = getWeekDays(currentDate)
//     const hours = Array.from({ length: 24 }, (_, i) => i)

//     return (
//       <div className="bg-white rounded-lg border border-gray-200">
//         {/* Week header */}
//         <div className="grid grid-cols-8 border-b border-gray-200">
//           <div className="p-3 text-sm font-medium text-gray-500"></div>
//           {weekDays.map((day, index) => (
//             <div key={index} className="p-3 text-center border-l border-gray-200">
//               <div className="text-sm font-medium text-gray-500">
//                 {day.toLocaleDateString("en-US", { weekday: "short" })}
//               </div>
//               <div
//                 className={`text-lg font-semibold mt-1 ${
//                   isToday(day)
//                     ? "bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
//                     : "text-gray-900"
//                 }`}
//               >
//                 {day.getDate()}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Week grid */}
//         <div className="max-h-[600px] overflow-y-auto">
//           <div className="grid grid-cols-8">
//             {/* Time column */}
//             <div className="border-r border-gray-200">
//               {hours.map((hour) => (
//                 <div key={hour} className="h-16 p-2 border-b border-gray-100 text-xs text-gray-500">
//                   {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
//                 </div>
//               ))}
//             </div>

//             {/* Day columns */}
//             {weekDays.map((day, dayIndex) => (
//               <div key={dayIndex} className="border-r border-gray-200">
//                 {hours.map((hour) => {
//                   const dayEvents = getEventsForDate(day).filter((event) => {
//                     const eventHour = Number.parseInt(event.time.split(":")[0])
//                     const isPM = event.time.includes("PM")
//                     const adjustedHour =
//                       isPM && eventHour !== 12 ? eventHour + 12 : eventHour === 12 && !isPM ? 0 : eventHour
//                     return adjustedHour === hour
//                   })

//                   return (
//                     <div key={hour} className="h-16 p-1 border-b border-gray-100 relative">
//                       {dayEvents.map((event) => (
//                         <div
//                           key={event.id}
//                           onClick={() => handleEventClick(event)}
//                           className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${event.color} text-white truncate mb-1`}
//                         >
//                           {event.title}
//                         </div>
//                       ))}
//                     </div>
//                   )
//                 })}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   const renderDayView = () => {
//     const hours = Array.from({ length: 24 }, (_, i) => i)
//     const dayEvents = getEventsForDate(currentDate)

//     return (
//       <div className="bg-white rounded-lg border border-gray-200">
//         {/* Day header */}
//         <div className="p-4 border-b border-gray-200">
//           <div className="text-center">
//             <div className="text-sm font-medium text-gray-500">
//               {currentDate.toLocaleDateString("en-US", { weekday: "long" })}
//             </div>
//             <div
//               className={`text-2xl font-semibold mt-1 ${
//                 isToday(currentDate)
//                   ? "bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto"
//                   : "text-gray-900"
//               }`}
//             >
//               {currentDate.getDate()}
//             </div>
//           </div>
//         </div>

//         {/* Day schedule */}
//         <div className="max-h-[600px] overflow-y-auto">
//           <div className="grid grid-cols-12">
//             {/* Time column */}
//             <div className="col-span-2 border-r border-gray-200">
//               {hours.map((hour) => (
//                 <div key={hour} className="h-16 p-2 border-b border-gray-100 text-xs text-gray-500">
//                   {hour === 0
//                     ? "12:00 AM"
//                     : hour < 12
//                       ? `${hour}:00 AM`
//                       : hour === 12
//                         ? "12:00 PM"
//                         : `${hour - 12}:00 PM`}
//                 </div>
//               ))}
//             </div>

//             {/* Events column */}
//             <div className="col-span-10">
//               {hours.map((hour) => {
//                 const hourEvents = dayEvents.filter((event) => {
//                   const eventHour = Number.parseInt(event.time.split(":")[0])
//                   const isPM = event.time.includes("PM")
//                   const adjustedHour =
//                     isPM && eventHour !== 12 ? eventHour + 12 : eventHour === 12 && !isPM ? 0 : eventHour
//                   return adjustedHour === hour
//                 })

//                 return (
//                   <div key={hour} className="h-16 p-2 border-b border-gray-100">
//                     {hourEvents.map((event) => (
//                       <div
//                         key={event.id}
//                         onClick={() => handleEventClick(event)}
//                         className={`p-2 rounded cursor-pointer hover:opacity-80 ${event.color} text-white mb-1`}
//                       >
//                         <div className="font-medium">{event.title}</div>
//                         <div className="text-xs opacity-90">
//                           {event.time} {event.endTime && `- ${event.endTime}`}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   const handleAddEvent = () => {
//     if (newEvent.title && newEvent.date && newEvent.startTime && newEvent.endTime) {
//       // In a real app, this would save to backend
//       console.log("Adding event:", newEvent)
//       setShowAddEvent(false)
//       setNewEvent({
//         title: "",
//         description: "",
//         date: "",
//         startTime: "",
//         endTime: "",
//         type: "meeting",
//         participant: "",
//         location: "",
//         attendees: [] as string[],
//       })
//     }
//   }

//   const handleEditEvent = (event: CalendarEvent) => {
//     console.log("Editing event:", event)
//     // Handle edit logic
//   }

//   const handleDeleteEvent = (event: CalendarEvent) => {
//     console.log("Deleting event:", event)
//     // Handle delete logic
//   }

//   const handleEventAction = (event: CalendarEvent, action: string) => {
//     console.log("Event action:", action, event)
//     // Handle specific actions like join meeting
//   }

//   return (
//     <div className="flex-1 overflow-auto bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex items-center justify-between">
//             <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                 <input
//                   type="text"
//                   placeholder="Search"
//                   className="pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-64"
//                 />
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">⌘K</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Calendar Controls */}
//         <div className="mb-6 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-2">
//               <button onClick={() => navigate("prev")} className="p-2 hover:bg-gray-100 rounded-md">
//                 <ChevronLeft className="h-4 w-4" />
//               </button>
//               <button onClick={() => navigate("next")} className="p-2 hover:bg-gray-100 rounded-md">
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             </div>
//             <button
//               onClick={goToToday}
//               className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
//             >
//               Today
//             </button>
//             <h2 className="text-xl font-semibold text-gray-900">{getNavigationTitle()}</h2>
//           </div>

//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-2">
//               <select
//                 value={view}
//                 onChange={(e) => setView(e.target.value as ViewType)}
//                 className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
//               >
//                 <option value="month">Month view</option>
//                 <option value="week">Week view</option>
//                 <option value="day">Day view</option>
//               </select>
//             </div>
//             <button
//               className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
//               onClick={() => setShowAddEvent(true)}
//             >
//               <Plus className="mr-2 h-4 w-4" />
//               Add event
//             </button>
//           </div>
//         </div>

//         {/* Calendar Content */}
//         <div className="mb-8">
//           {view === "month" && renderMonthView()}
//           {view === "week" && renderWeekView()}
//           {view === "day" && renderDayView()}
//         </div>

//         {/* Event Detail Modal */}
//         {showEventModal && selectedEvent && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
//                 <button onClick={() => setShowEventModal(false)} className="text-gray-400 hover:text-gray-600">
//                   <X className="h-5 w-5" />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <h4 className="font-medium text-gray-900">{selectedEvent.title}</h4>
//                   <div className="flex items-center text-sm text-gray-500 mt-1">
//                     <Clock className="mr-1 h-4 w-4" />
//                     {selectedEvent.time}
//                     {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
//                   </div>
//                 </div>

//                 {selectedEvent.description && (
//                   <div>
//                     <p className="text-sm text-gray-600">{selectedEvent.description}</p>
//                   </div>
//                 )}

//                 {selectedEvent.location && (
//                   <div className="flex items-center text-sm text-gray-500">
//                     <MapPin className="mr-1 h-4 w-4" />
//                     {selectedEvent.location}
//                   </div>
//                 )}

//                 {selectedEvent.attendees && (
//                   <div className="flex items-center text-sm text-gray-500">
//                     <Users className="mr-1 h-4 w-4" />
//                     {selectedEvent.attendees.join(", ")}
//                   </div>
//                 )}

//                 <div className="flex space-x-3 pt-4">
//                   <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
//                     <Edit className="mr-1 h-4 w-4" />
//                     Edit
//                   </button>
//                   <button className="flex items-center px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50">
//                     <Trash2 className="mr-1 h-4 w-4" />
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Add Event Modal */}
//         {showAddEvent && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 mt-8">
//             <div className="bg-white rounded-lg p-6 w-[650px] max-h-[80vh] mx-4 overflow-y-auto">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-gray-900">Add New Event</h3>
//                 <button onClick={() => setShowAddEvent(false)} className="p-1 text-gray-400 hover:text-gray-600">
//                   <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                   <input
//                     type="text"
//                     value={newEvent.title}
//                     onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Event title"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <textarea
//                     value={newEvent.description}
//                     onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     rows={3}
//                     placeholder="Event description"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                   <input
//                     type="date"
//                     value={newEvent.date}
//                     onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
//                     <input
//                       type="time"
//                       value={newEvent.startTime}
//                       onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
//                     <input
//                       type="time"
//                       value={newEvent.endTime}
//                       onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
//                   <select
//                     value={newEvent.type}
//                     onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as EventType })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="meeting">Meeting</option>
//                     <option value="standup">Standup</option>
//                     <option value="review">Review</option>
//                     <option value="planning">Planning</option>
//                     <option value="demo">Demo</option>
//                     <option value="coffee">Coffee</option>
//                     <option value="lunch">Lunch</option>
//                     <option value="dinner">Dinner</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Participant (Optional)</label>
//                   <input
//                     type="text"
//                     value={newEvent.participant}
//                     onChange={(e) => setNewEvent({ ...newEvent, participant: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Participant name"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Location (Optional)</label>
//                   <input
//                     type="text"
//                     value={newEvent.location}
//                     onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Meeting location or platform"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Attendees (Optional)</label>
//                   <input
//                     type="text"
//                     value={newEvent.attendees.join(", ")}
//                     onChange={(e) =>
//                       setNewEvent({ ...newEvent, attendees: e.target.value.split(", ").filter(Boolean) })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Attendees names"
//                   />
//                 </div>

//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     onClick={() => setShowAddEvent(false)}
//                     className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleAddEvent}
//                     className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
//                   >
//                     Add Event
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

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

export default function CalendarPage() {
  return <Calendar events={events} />
}
