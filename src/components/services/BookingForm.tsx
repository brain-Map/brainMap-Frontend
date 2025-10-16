"use client"

import { useState, useEffect } from "react"
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

// Generate daily 30-minute slots for a full day (00:00 - 23:30)
const generateDailyTimeSlots = (): string[] => {
  const slots: string[] = []
  for (let minutes = 0; minutes < 24 * 60; minutes += 30) {
    const hour = Math.floor(minutes / 60)
    const min = minutes % 60
    slots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`)
  }
  return slots
}

export function BookingForm({ service }: BookingFormProps) {
  const router = useRouter()
  // Booking mode: HOURLY | MONTHLY | PROJECT_BASED
  const [bookingMode, setBookingMode] = useState<'HOURLY' | 'MONTHLY' | 'PROJECT_BASED'>(() => {
    // initialize booking mode to first available mode from service.availabilityModes or default to HOURLY
    const modes: string[] = (service as any).availabilityModes || []
    if (modes.includes('HOURLY')) return 'HOURLY'
    if (modes.includes('MONTHLY')) return 'MONTHLY'
    if (modes.includes('PROJECT_BASED')) return 'PROJECT_BASED'
    return 'HOURLY'
  })
  const [requestedMonths, setRequestedMonths] = useState<string[]>([])
  const [monthInput, setMonthInput] = useState<string>('')
  const [projectDeadline, setProjectDeadline] = useState<string>('')
  const [selectedPricingId, setSelectedPricingId] = useState<string | undefined>(undefined)
  // Auto select pricing based on bookingMode
  // map bookingMode to pricingType used by backend
  const pricingTypeForMode = (mode: string) => {
    if (mode === 'HOURLY') return 'hourly'
    if (mode === 'MONTHLY') return 'monthly'
    return 'project-based'
  }

  // Auto-assign pricing when booking mode or service.pricings change
  // and clear mode-specific inputs when switching
  useEffect(() => {
    const type = pricingTypeForMode(bookingMode)
    const p = (service as any).pricings?.find((p: any) => p.pricingType === type)
    if (p) setSelectedPricingId(p.pricingId)
    else setSelectedPricingId(undefined)

    // Clear inputs irrelevant to the selected mode
    setRequestedMonths([])
    setMonthInput('')
    setProjectDeadline('')
    setSelectedDate(null)
    setStartTime('')
    setEndTime('')
  }, [bookingMode, (service as any).pricings])

  // Use correct rate based on available pricings
  // derive rates from pricings array if present
  const findPrice = (type: string) => {
    const p = (service as any).pricings?.find((x: any) => x.pricingType === type)
    return p ? Number(p.price) : undefined
  }

  const findPricingById = (id?: string) => {
    if (!id) return undefined
    return (service as any).pricings?.find((p: any) => p.pricingId === id)
  }

  const hourlyRate = findPrice('hourly') ?? (service.hourlyRatePerPerson || service.hourlyRatePerGroup || 1000)

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
  const availabilityModes: string[] = (service as any).availabilityModes || []

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const isSameDay = (dateA: Date, dateB: Date) => {
    const normalizedA = new Date(dateA)
    normalizedA.setHours(0, 0, 0, 0)
    const normalizedB = new Date(dateB)
    normalizedB.setHours(0, 0, 0, 0)
    return normalizedA.getTime() === normalizedB.getTime()
  }

  
  // Available time slots for selected date (allow any future date/time)
  // Use full-day 30-min slots so the user can pick any time on the selected future date
  const availableTimeSlots = selectedDate ? generateDailyTimeSlots() : []

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

    // Allow any end times later than the start time on the same day
    return availableTimeSlots.filter((time: string) => {
      const [hour, min] = time.split(':').map(Number)
      const timeMinutes = hour * 60 + min
      return timeMinutes > startMinutes
    })
  }

  // Round a time string (HH:MM) to nearest 30-minute interval
  const roundTo30Min = (time: string) => {
    if (!time) return time
    const [h, m] = time.split(':').map(Number)
    const total = h * 60 + m
    const rounded = Math.round(total / 30) * 30
    const rh = Math.floor((rounded % (24 * 60)) / 60)
    const rm = rounded % 60
    return `${rh.toString().padStart(2, '0')}:${rm.toString().padStart(2, '0')}`
  }

  // Calculate total price
  const totalHours = calculateDurationHours(startTime, endTime)
  // Determine pricing-based total depending on bookingMode and selectedPricing
  const selectedPricing = findPricingById(selectedPricingId)
  let totalPrice = 0
  if (bookingMode === 'HOURLY') {
    const rate = selectedPricing ? Number(selectedPricing.price) : hourlyRate
    totalPrice = Math.round((rate || 0) * totalHours)
  } else if (bookingMode === 'MONTHLY') {
    const monthsCount = requestedMonths.length
    const monthlyPrice = selectedPricing ? Number(selectedPricing.price) : findPrice('monthly') || 0
    totalPrice = Math.round(monthlyPrice * monthsCount)
  } else if (bookingMode === 'PROJECT_BASED') {
    totalPrice = selectedPricing ? Math.round(Number(selectedPricing.price)) : 0
  }

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
        if (bookingMode === 'HOURLY') {
          // ensure start/end exist and are valid 30-min aligned times and duration > 0
          if (!selectedDate || !startTime || !endTime) return false
          const rs = roundTo30Min(startTime)
          const re = roundTo30Min(endTime)
          const dur = calculateDurationHours(rs, re)
          return dur > 0
        }
        if (bookingMode === 'MONTHLY') return requestedMonths.length > 0
        if (bookingMode === 'PROJECT_BASED') return !!projectDeadline
        return false
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
    // Validate based on bookingMode
    if (bookingMode === 'HOURLY') {
      if (!selectedDate || !startTime || !endTime) {
        alert("Please select a date and time range")
        return
      }
    }
    if (bookingMode === 'MONTHLY') {
      if (requestedMonths.length === 0) {
        alert('Please select at least one month')
        return
      }
    }
    if (bookingMode === 'PROJECT_BASED') {
      if (!projectDeadline) {
        alert('Please select an approximate project deadline')
        return
      }
    }

    setIsSubmitting(true)

    try {
      // Build booking payload per bookingMode
      // Build booking payload exactly as backend expects
      const bookingData: any = {
        serviceId: service.serviceId.toString(),
        selectedPricingId: selectedPricingId || undefined,
        projectDetails: projectDetails || undefined,
        bookingMode,
        requestedMonths: bookingMode === 'MONTHLY' ? requestedMonths : undefined,
        projectDeadline: bookingMode === 'PROJECT_BASED' ? projectDeadline || undefined : undefined,
        requestedDate: bookingMode === 'HOURLY' && selectedDate ? selectedDate.toISOString().split('T')[0] : undefined,
        requestedStartTime: bookingMode === 'HOURLY' ? (startTime || undefined) : undefined,
        requestedEndTime: bookingMode === 'HOURLY' ? (endTime || undefined) : undefined,
        totalPrice: Number(totalPrice) || 0,
      }

      // Remove undefined keys so the backend receives only provided fields
      Object.keys(bookingData).forEach((key) => {
        if (bookingData[key] === undefined) delete bookingData[key]
      })

      console.log("Booking details:", bookingData)

      // Call the API
      // await bookingApi.createBooking(bookingData)

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
    // For MONTHLY mode we show month selector UI here instead of calendar/time slots
    if (bookingMode === 'MONTHLY') {
      // Render a 12-month grid (current month + next 11) styled like the day cells
      const months: Date[] = []
      const startMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      for (let i = 0; i < 12; i++) {
        months.push(new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1))
      }

      // A month is selectable if it's not in the past. We no longer block months
      // based on mentor availability — users can pick any future month.
      const isMonthAvailable = (monthDate: Date) => {
        const isPastMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getTime() < new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1).getTime()
        return !isPastMonth
      }

      const toggleMonth = (date: Date) => {
        const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
        setRequestedMonths(prev => {
          const set = new Set(prev)
          if (set.has(key)) set.delete(key)
          else set.add(key)
          return Array.from(set).sort()
        })
      }

      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Select Months
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Choose months for an ongoing mentorship</p>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Months</label>
              <div className="grid grid-cols-4 gap-2">
                {months.map((m) => {
                  const monthKey = `${m.getFullYear()}-${(m.getMonth() + 1).toString().padStart(2, '0')}`
                  const isPastMonth = new Date(m.getFullYear(), m.getMonth(), 1).getTime() < new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1).getTime()
                  const available = isMonthAvailable(m)
                  const selected = requestedMonths.includes(monthKey)

                  const baseClasses = "relative flex h-12 items-center justify-center rounded-lg border text-sm transition-all"
                  let stateClasses = "border-gray-200 bg-white text-gray-900"
                  if (isPastMonth) stateClasses = "border-transparent bg-gray-50 text-gray-300"
                  if (available && !isPastMonth) stateClasses = "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-400 hover:bg-blue-100"
                  if (selected) stateClasses = "border-blue-600 bg-blue-600 text-white"

                  return (
                    <button
                      key={monthKey}
                      type="button"
                      disabled={isPastMonth}
                      onClick={() => toggleMonth(m)}
                      className={`${baseClasses} ${stateClasses} ${selected ? "shadow" : ""} ${isPastMonth ? "cursor-not-allowed" : ""}`}
                    >
                      <span className="font-semibold">{m.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                      {available && !selected && (
                        <span className="absolute bottom-1 h-1 w-1 rounded-full bg-blue-500" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-2 flex gap-2 flex-wrap">
              {requestedMonths.map(m => (
                <Badge key={m}>{m}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )
    }

    // For PROJECT_BASED we show a deadline selector and no time slots
    if (bookingMode === 'PROJECT_BASED') {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Project Timeline
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Provide an approximate deadline for your project</p>
          </CardHeader>
          <CardContent>
            <div className="mt-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Approximate Project Deadline</label>
              <input type="date" value={projectDeadline} onChange={(e) => setProjectDeadline(e.target.value)} className="px-3 py-2 border rounded-lg" />
            </div>
          </CardContent>
        </Card>
      )
    }

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
          {/* Show mentor weekly availability if provided, but do not block selection when empty */}
          {availabilities.length > 0 && (
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
                // Allow any future date in the current month to be selectable
                const isAvailableDay = isDateAvailable(date, availabilities)
                const isSelectable = isInCurrentMonth && !isPast
                const isSelected = selectedDate ? isSameDay(normalizedDate, selectedDate) : false

                const baseClasses = "relative flex h-12 items-center justify-center rounded-lg border text-sm transition-all"

                let stateClasses = "border-gray-200 bg-white text-gray-900"
                if (!isInCurrentMonth) {
                  stateClasses = "border-transparent bg-gray-50 text-gray-300"
                }
                if (isPast) {
                  stateClasses = "border-transparent bg-gray-50 text-gray-300"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Manual time input (30-minute step) */}
                <input
                  type="time"
                  step={1800}
                  value={startTime}
                  onChange={(e) => {
                    const val = e.target.value
                    const rounded = roundTo30Min(val)
                    setStartTime(rounded)
                    // Reset endTime if invalid
                    if (endTime && calculateDurationHours(rounded, endTime) <= 0) {
                      setEndTime("")
                    }
                  }}
                  className="px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* End Time */}
            {startTime && (
              <div className="animate-in slide-in-from-bottom-4 duration-300">
                <Label className="text-base font-semibold mb-3 block">
                  End Time
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Manual end time input */}
                  <input
                    type="time"
                    step={1800}
                    value={endTime}
                    onChange={(e) => {
                      const val = e.target.value
                      const rounded = roundTo30Min(val)
                      // Ensure end is after start
                      const dur = calculateDurationHours(startTime, rounded)
                      if (dur > 0) setEndTime(rounded)
                      else setEndTime("")
                    }}
                    className="px-3 py-2 border rounded-lg"
                  />

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

      
      {/* Booking mode-only flow: pricing and session type are auto-handled */}
      <div className="mb-6">
        <div className="text-sm text-gray-600">Booking mode pricing is auto-selected based on the chosen mode below.</div>
      </div>

      {/* Booking Mode & Pricing */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <label
            className={`px-3 py-2 rounded-lg border cursor-pointer ${bookingMode === 'HOURLY' ? 'bg-blue-600 text-white' : ''} ${!availabilityModes.includes('HOURLY') ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => availabilityModes.includes('HOURLY') && setBookingMode('HOURLY')}
          >
            Hourly
          </label>
          <label
            className={`px-3 py-2 rounded-lg border cursor-pointer ${bookingMode === 'MONTHLY' ? 'bg-blue-600 text-white' : ''} ${!availabilityModes.includes('MONTHLY') ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => availabilityModes.includes('MONTHLY') && setBookingMode('MONTHLY')}
          >
            Monthly
          </label>
          <label
            className={`px-3 py-2 rounded-lg border cursor-pointer ${bookingMode === 'PROJECT_BASED' ? 'bg-blue-600 text-white' : ''} ${!availabilityModes.includes('PROJECT_BASED') ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => availabilityModes.includes('PROJECT_BASED') && setBookingMode('PROJECT_BASED')}
          >
            Project
          </label>
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
                  <span className="font-medium text-blue-700">{bookingMode === 'HOURLY' ? 'Hourly' : bookingMode === 'MONTHLY' ? 'Monthly' : 'Project'}</span>
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

              {/* Price Breakdown (dynamic by booking mode) */}
              {(() => {
                const modeLabel = bookingMode === 'HOURLY' ? 'Hourly Rate' : bookingMode === 'MONTHLY' ? 'Monthly Rate' : 'Project Fee'
                const modePrice = selectedPricing ? Number(selectedPricing.price) : (
                  bookingMode === 'HOURLY' ? (findPrice('hourly') ?? hourlyRate) : bookingMode === 'MONTHLY' ? (findPrice('monthly') ?? 0) : (findPrice('project-based') ?? 0)
                )

                return (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Price Breakdown</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{modeLabel}</span>
                        <span className="font-medium">{modePrice > 0 ? `Rs.${modePrice.toLocaleString()}` : 'TBD'}</span>
                      </div>

                      {bookingMode === 'HOURLY' && totalHours > 0 && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Duration</span>
                            <span className="font-medium">{formatDuration(totalHours)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-900">Total</span>
                            <span className="text-xl font-bold text-blue-600">Rs.{totalPrice.toLocaleString()}</span>
                          </div>
                        </>
                      )}

                      {bookingMode === 'MONTHLY' && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Months</span>
                            <span className="font-medium">{requestedMonths.length} selected</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-900">Total</span>
                            <span className="text-xl font-bold text-blue-600">Rs.{totalPrice.toLocaleString()}</span>
                          </div>
                        </>
                      )}

                      {bookingMode === 'PROJECT_BASED' && (
                        <>
                          {projectDeadline && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Deadline</span>
                              <span className="font-medium">{projectDeadline}</span>
                            </div>
                          )}
                          <Separator />
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-900">Total</span>
                            <span className="text-xl font-bold text-blue-600">{modePrice > 0 ? `Rs.${Math.round(modePrice).toLocaleString()}` : `Rs.${totalPrice.toLocaleString()}`}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              })()}

              <Separator />

            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
