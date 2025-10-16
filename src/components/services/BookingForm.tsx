"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  User,
  Calendar,
  FileText,
  CheckCircle,
  ChevronRight,
  ChevronLeft
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ServiceListing, ServiceAvailability } from "@/types/service"
import { bookingApi } from "@/services/bookingApi"

type ExtendedServiceListing = ServiceListing & {
  mentorName?: string;
  mentorAvatar?: string;
  subject?: string;
  hourlyRatePerPerson?: number;
  hourlyRatePerGroup?: number;
  serviceId: string | number;
  mentorId: string | number;
  title?: string;
  availabilities?: ServiceAvailability[];
};

interface BookingFormProps {
  service: ExtendedServiceListing;

}

type BookingStep = "datetime" | "duration" | "details" | "confirm";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

// Helper function to check if a date matches any availability day
const isDateAvailable = (date: Date, availabilities: ServiceAvailability[]): boolean => {
  const dayOfWeek = date.getDay()
  return availabilities.some(avail => avail.dayOfWeek === dayOfWeek)
}

// Helper function to get availability for a specific date
const getAvailabilityForDate = (date: Date, availabilities: ServiceAvailability[]): ServiceAvailability[] => {
  const dayOfWeek = date.getDay()
  return availabilities.filter(avail => avail.dayOfWeek === dayOfWeek)
}

// Helper function to generate time slots from availability ranges
const generateTimeSlotsFromAvailability = (availabilities: ServiceAvailability[]): string[] => {
  const slots = new Set<string>()
  
  availabilities.forEach(avail => {
    const [startHour, startMin] = avail.startTime.split(':').map(Number)
    const [endHour, endMin] = avail.endTime.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    // Generate 30-minute slots
    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
      const hour = Math.floor(minutes / 60)
      const min = minutes % 60
      slots.add(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`)
    }
    // Add the end time as well
    slots.add(`${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`)
  })
  
  return Array.from(slots).sort()
}

export function BookingForm({ service }: BookingFormProps) {
  const router = useRouter()
  // Session type: 'individual' or 'group'
  const [sessionType, setSessionType] = useState<'individual' | 'group'>('individual')
  // Use correct rate based on session type
  const hourlyRate = sessionType === 'individual'
    ? service.hourlyRatePerPerson || 1000
    : service.hourlyRatePerGroup || 2000

  // Multi-step state
  const [currentStep, setCurrentStep] = useState<BookingStep>("datetime")

  // State for booking details
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [projectDetails, setProjectDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  // Get service availabilities
  const availabilities = service.availabilities || []

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const isSameDay = (dateA: Date, dateB: Date) => {
    const normalizedA = new Date(dateA)
    normalizedA.setHours(0, 0, 0, 0)
    const normalizedB = new Date(dateB)
    normalizedB.setHours(0, 0, 0, 0)
    return normalizedA.getTime() === normalizedB.getTime()
  }

  
  // Available time slots for selected date
  const availableTimeSlots = selectedDate 
    ? generateTimeSlotsFromAvailability(getAvailabilityForDate(selectedDate, availabilities))
    : []

  // Calculate duration from start and end time
  const calculateDurationHours = (start: string, end: string): number => {
    if (!start || !end) return 0
    
    const [startHour, startMin] = start.split(':').map(Number)
    const [endHour, endMin] = end.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    const durationMinutes = endMinutes - startMinutes
    return durationMinutes > 0 ? durationMinutes / 60 : 0
  }

  // Get available end times based on start time
  const getAvailableEndTimes = (start: string): string[] => {
    if (!start || !selectedDate) return []
    
    const [startHour, startMin] = start.split(':').map(Number)
    const startMinutes = startHour * 60 + startMin
    
    // Get the availability ranges for the selected date
    const dayAvailabilities = getAvailabilityForDate(selectedDate, availabilities)
    
    // Find which availability range the start time falls into
    const applicableAvailability = dayAvailabilities.find(avail => {
      const [availStartHour, availStartMin] = avail.startTime.split(':').map(Number)
      const [availEndHour, availEndMin] = avail.endTime.split(':').map(Number)
      
      const availStartMinutes = availStartHour * 60 + availStartMin
      const availEndMinutes = availEndHour * 60 + availEndMin
      
      return startMinutes >= availStartMinutes && startMinutes < availEndMinutes
    })
    
    if (!applicableAvailability) return []
    
    const [availEndHour, availEndMin] = applicableAvailability.endTime.split(':').map(Number)
    const availEndMinutes = availEndHour * 60 + availEndMin
    
    return availableTimeSlots.filter((time: string) => {
      const [hour, min] = time.split(':').map(Number)
      const timeMinutes = hour * 60 + min
      return timeMinutes > startMinutes && timeMinutes <= availEndMinutes
    })
  }

  // Calculate total price
  const totalHours = calculateDurationHours(startTime, endTime)
  const totalPrice = Math.round(hourlyRate * totalHours)

  // Format hours for display
  const formatDuration = (hours: number) => {
    const wholeHours = Math.floor(hours)
    const minutes = Math.round((hours - wholeHours) * 60)
    
    if (minutes === 0) {
      return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}`
    } else if (wholeHours === 0) {
      return `${minutes} minutes`
    } else {
      return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''} ${minutes} min`
    }
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  // Check if we can proceed to next step
  const canProceed = () => {
    switch (currentStep) {
      case "datetime":
        return selectedDate && startTime && endTime && totalHours > 0
      case "duration":
        return true // Skip this step now
      case "details":
        return projectDetails.trim().length > 0
      default:
        return false
    }
  }

  // Navigate steps
  const nextStep = () => {
    if (currentStep === "datetime") setCurrentStep("details")
    else if (currentStep === "details") setCurrentStep("confirm")
  }

  const prevStep = () => {
    if (currentStep === "confirm") setCurrentStep("details")
    else if (currentStep === "details") setCurrentStep("datetime")
  }

  const handleSubmit = async () => {
    if (!selectedDate || !startTime || !endTime) {
      alert("Please select a date and time range")
      return
    }

    setIsSubmitting(true)

    try {
      // Format the date and time for API
      const requestedDate = selectedDate.toISOString().split('T')[0]
      const requestedStartTime = startTime
      const requestedEndTime = endTime

      const bookingData = {
        serviceId: service.serviceId.toString(),
        duration: totalHours,
        projectDetails,
        requestedDate,
        requestedStartTime,
        requestedEndTime,
        totalPrice,
        domainExpertId: service.mentorId.toString(),
        sessionType,
      }

      console.log("Booking details:", bookingData)

      // Call the API
      await bookingApi.createBooking(bookingData)

      // Show success message and redirect
      alert(`Booking request submitted successfully!\nTotal: Rs.${totalPrice.toLocaleString()}`)
      router.push(`/services/${service.serviceId}`)
    } catch (error: any) {
      console.error("Error submitting booking:", error)
      const message = error?.message || error?.response?.data?.message || 'Failed to submit booking. Please try again.'
      alert(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render step indicator
  const renderStepIndicator = () => {
    const steps = [
      { key: "datetime", label: "Date & Time", number: 1 },
      { key: "details", label: "Details", number: 2 },
      { key: "confirm", label: "Confirm", number: 3 },
    ]

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, index) => {
            const isActive = currentStep === step.key
            const isCompleted = steps.findIndex(s => s.key === currentStep) > index
            
            return (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      isActive
                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                        : isCompleted
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <p
                    className={`text-xs mt-2 font-medium ${
                      isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-all ${
                      isCompleted ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Render date and time selection
  const renderDateTimeStep = () => {
    const selectedDateAvailabilities = selectedDate 
      ? getAvailabilityForDate(selectedDate, availabilities)
      : []

    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const startOffset = monthStart.getDay()
    const gridStart = new Date(monthStart)
    gridStart.setDate(gridStart.getDate() - startOffset)

    const calendarDays: Date[] = []
    const cursor = new Date(gridStart)
    for (let i = 0; i < 42; i++) {
      calendarDays.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }

    const hasAvailableDatesInMonth = calendarDays.some((date) => {
      const normalizedDate = new Date(date)
      normalizedDate.setHours(0, 0, 0, 0)
      return (
        date.getMonth() === currentMonth.getMonth() &&
        normalizedDate.getTime() >= startOfToday.getTime() &&
        isDateAvailable(date, availabilities)
      )
    })

    const startOfCurrentMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1)
    const goToPreviousMonth = () => {
      if (currentMonth.getTime() <= startOfCurrentMonth.getTime()) return
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    }

    const goToNextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    }
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Select Date & Time
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Choose when you'd like to have your mentorship session
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Availability Info */}
          {availabilities.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 font-medium">
                ⚠️ No availability set for this service. Please contact the mentor directly.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                📅 Mentor's Weekly Availability
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(availabilities.map(a => a.dayOfWeek)))
                  .sort()
                  .map(day => (
                    <Badge key={day} variant="outline" className="bg-white text-blue-700 border-blue-300">
                      {dayNames[day]}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* Monthly Calendar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-semibold">Select a Date</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={goToPreviousMonth}
                  disabled={currentMonth.getTime() <= startOfCurrentMonth.getTime()}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="text-sm font-semibold text-gray-700 min-w-[140px] text-center">
                  {monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={goToNextMonth}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase text-gray-500">
              {dayNames.map(day => (
                <div key={day}>{day.slice(0, 3)}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 mt-2">
              {calendarDays.map((date) => {
                const normalizedDate = new Date(date)
                normalizedDate.setHours(0, 0, 0, 0)
                const isInCurrentMonth = date.getMonth() === currentMonth.getMonth()
                const isPast = normalizedDate.getTime() < startOfToday.getTime()
                const isAvailableDay = isDateAvailable(date, availabilities)
                const isSelectable = isInCurrentMonth && !isPast && isAvailableDay
                const isSelected = selectedDate ? isSameDay(normalizedDate, selectedDate) : false

                const baseClasses = "relative flex h-12 items-center justify-center rounded-lg border text-sm transition-all"

                let stateClasses = "border-gray-200 bg-white text-gray-900"
                if (!isInCurrentMonth) {
                  stateClasses = "border-transparent bg-gray-50 text-gray-300"
                }
                if (!isAvailableDay || isPast) {
                  stateClasses = "border-gray-100 bg-gray-100 text-gray-400"
                }
                if (isSelectable) {
                  stateClasses = "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-400 hover:bg-blue-100"
                }
                if (isSelected) {
                  stateClasses = "border-blue-600 bg-blue-600 text-white"
                }

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    disabled={!isSelectable}
                    onClick={() => {
                      setSelectedDate(new Date(date))
                      setStartTime("")
                      setEndTime("")
                    }}
                    className={`${baseClasses} ${stateClasses} ${isSelected ? "shadow" : ""} ${!isSelectable ? "cursor-not-allowed" : ""}`}
                  >
                    <span className="font-semibold">{date.getDate()}</span>
                    {isSelectable && !isSelected && (
                      <span className="absolute bottom-1 h-1 w-1 rounded-full bg-blue-500" />
                    )}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-3 mt-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <span className="inline-flex h-3 w-3 rounded bg-blue-600" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-flex h-3 w-3 rounded bg-blue-100 border border-blue-200" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-flex h-3 w-3 rounded bg-gray-200" />
                <span>Unavailable</span>
              </div>
            </div>
            {availabilities.length > 0 && !hasAvailableDatesInMonth && (
              <p className="mt-3 text-sm text-gray-500">
                No available dates in this month. Try navigating to a different month.
              </p>
            )}
          </div>

          {/* Show availability time ranges for selected date */}
          {selectedDate && selectedDateAvailabilities.length > 0 && (
            <div className="animate-in slide-in-from-bottom-4 duration-300 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-green-900 mb-2">
                🕒 Available Time Slots for {dayNames[selectedDate.getDay()]}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedDateAvailabilities.map((avail, idx) => (
                  <Badge key={idx} variant="outline" className="bg-white text-green-700 border-green-300">
                    {avail.startTime} - {avail.endTime}
                  </Badge>
                ))}
              </div>
            </div>
          )}

        {/* Time Selection */}
        {selectedDate && (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
            <Separator className="mb-6" />
            
            {/* Start Time */}
            <div className="mb-6">
              <Label className="text-base font-semibold mb-3 block">
                Start Time
              </Label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {availableTimeSlots.map((time) => {
                  const isSelected = startTime === time
                  return (
                    <button
                      key={time}
                      onClick={() => {
                        setStartTime(time)
                        // Reset end time if it's not valid anymore
                        if (endTime && calculateDurationHours(time, endTime) <= 0) {
                          setEndTime("")
                        }
                      }}
                      className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >
                      {time}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* End Time */}
            {startTime && (
              <div className="animate-in slide-in-from-bottom-4 duration-300">
                <Label className="text-base font-semibold mb-3 block">
                  End Time
                </Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {getAvailableEndTimes(startTime).map((time) => {
                    const isSelected = endTime === time
                    return (
                      <button
                        key={time}
                        onClick={() => setEndTime(time)}
                        className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          isSelected
                            ? "border-green-600 bg-green-600 text-white"
                            : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                        }`}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedDate && startTime && endTime && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in slide-in-from-bottom-4 duration-300 mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">
                  {formatDate(selectedDate)}: {startTime} - {endTime}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600">Duration</p>
                <p className="text-lg font-bold text-green-700">
                  {formatDuration(totalHours)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    )
  }

  // Render project details
  const renderDetailsStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Project Details
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Tell the mentor about your project and what you need help with
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="projectDetails" className="text-base font-semibold">
            Describe Your Project
          </Label>
          <Textarea
            id="projectDetails"
            value={projectDetails}
            onChange={(e) => setProjectDetails(e.target.value)}
            placeholder="Describe your project, what you want to achieve, specific challenges you're facing, and what you'd like to focus on during the session..."
            className="min-h-[250px] resize-none"
            required
          />
          <p className="text-xs text-gray-500">
            {projectDetails.length} characters
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-yellow-800 mb-2">💡 Tip</p>
          <p className="text-sm text-yellow-700">
            The more details you provide, the better the mentor can prepare for your session and provide targeted guidance.
          </p>
        </div>
      </CardContent>
    </Card>
  )

  // Render confirmation
  const renderConfirmStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          Confirm Your Booking
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Review your booking details before submitting
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Booking Summary */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Session Details</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Date & Time</p>
                  <p className="text-base font-semibold text-gray-900">
                    {selectedDate && formatDate(selectedDate)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {startTime} - {endTime}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Duration</p>
                  <p className="text-base font-semibold text-gray-900">
                    {formatDuration(totalHours)}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-600">
                    Rs.{totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Project Details</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{projectDetails}</p>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-blue-900 mb-3">
            Important Information
          </h3>
          <div className="flex items-start gap-2 text-sm text-blue-800">
            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>The mentor will review your request and confirm within 24 hours</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-blue-800">
            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>You can cancel or reschedule up to 24 hours before the session</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-blue-800">
            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>Payment will be processed after the mentor confirms your booking</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <>
      {/* Header with back button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Service
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Book a Session</h1>
        <p className="text-gray-600 mt-2">
          Schedule your mentorship session with {service.mentorName || "your mentor"}
        </p>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      
      {/* Session Type Selection */}
      <div className="mb-8">
        <div className="flex gap-4">
          <Button
            type="button"
            variant={sessionType === 'individual' ? 'default' : 'outline'}
            className={sessionType === 'individual' ? 'bg-blue-600 text-white' : ''}
            onClick={() => setSessionType('individual')}
          >
            Individual Session
          </Button>
          <Button
            type="button"
            variant={sessionType === 'group' ? 'default' : 'outline'}
            className={sessionType === 'group' ? 'bg-purple-600 text-white' : ''}
            onClick={() => setSessionType('group')}
          >
            Group Session
          </Button>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {sessionType === 'individual'
            ? `Hourly Rate: Rs.${(service.hourlyRatePerPerson || 1000).toLocaleString()} per person`
            : `Hourly Rate: Rs.${(service.hourlyRatePerGroup || 2000).toLocaleString()} per group`}
        </div>
      </div>

      

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Booking Form */}
        <div className="lg:col-span-2">
          {currentStep === "datetime" && renderDateTimeStep()}
          {currentStep === "details" && renderDetailsStep()}
          {currentStep === "confirm" && renderConfirmStep()}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            {currentStep !== "datetime" && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex-1"
                disabled={isSubmitting}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            
            {currentStep !== "confirm" ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar - Service Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mentor Info */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Mentor</p>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-blue-200">
                    <AvatarImage src={service.mentorAvatar} alt={service.mentorName} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                      {service.mentorName?.charAt(0) || "M"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {service.mentorName || "Expert Mentor"}
                    </p>
                    <p className="text-sm text-gray-600">{service.subject}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Service Info */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Service</p>
                <p className="text-gray-900 font-medium">{service.title}</p>
              </div>

              <Separator />

              {/* Session Type Info */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Session Type</p>
                <div className="bg-gray-50 rounded-lg p-2">
                  <span className="font-medium text-blue-700">
                    {sessionType === 'individual' ? 'Individual' : 'Group'}
                  </span>
                </div>
              </div>
              <Separator />

              {/* Selected Date/Time */}
              {selectedDate && startTime && endTime && (
                <>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Scheduled</p>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-900">
                        {formatDate(selectedDate)}
                      </p>
                      <p className="text-base font-bold text-blue-600">
                        {startTime} - {endTime}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        ({formatDuration(totalHours)})
                      </p>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Price Breakdown */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 mb-2">Price Breakdown</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Hourly Rate</span>
                    <span className="font-medium">Rs.{hourlyRate.toLocaleString()}</span>
                  </div>
                  {totalHours > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium">{formatDuration(totalHours)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-blue-600">
                          Rs.{totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Additional Info */}
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <User className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span>{sessionType === 'individual' ? 'One-on-one personalized mentorship' : 'Group mentorship session'}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span>Confirmation within 24 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
