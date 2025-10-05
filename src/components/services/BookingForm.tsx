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
  CheckCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ServiceListing } from "@/types/service"

interface BookingFormProps {
  service: ServiceListing & {
    mentorName?: string
    hourlyRate?: number
  }
}

export function BookingForm({ service }: BookingFormProps) {
  const router = useRouter()
  const hourlyRate = service.hourlyRate || 1000
  
  // State for booking details
  const [hours, setHours] = useState(1) // Duration in hours
  const [projectDetails, setProjectDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate total hours from slider value (in 15-minute increments)
  // Slider value ranges from 1 to 48 (representing 15 min to 12 hours in 15-min steps)
  const [sliderValue, setSliderValue] = useState(4) // Default to 1 hour (4 * 15 min)
  
  // Convert slider value to hours
  const calculateHours = (value: number) => {
    return value * 0.25 // Each step is 15 minutes = 0.25 hours
  }

  // Calculate total price
  const totalHours = calculateHours(sliderValue)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!projectDetails.trim()) {
      alert("Please provide project details")
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Implement actual booking API call
      console.log("Booking details:", {
        serviceId: service.serviceId,
        mentorId: service.mentorId,
        duration: totalHours,
        projectDetails,
        totalPrice,
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Show success message and redirect
      alert(`Booking request submitted successfully!\nTotal: Rs.${totalPrice.toLocaleString()}`)
      router.push(`/services/${service.serviceId}`)
    } catch (error) {
      console.error("Error submitting booking:", error)
      alert("Failed to submit booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

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
          Schedule your mentorship session and provide project details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Booking Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Session Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Duration Slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="duration" className="text-base font-semibold">
                      Session Duration
                    </Label>
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
                      <Clock className="w-5 h-5" />
                      {formatDuration(totalHours)}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Slider
                      id="duration"
                      min={1}
                      max={48}
                      step={1}
                      value={[sliderValue]}
                      onValueChange={(value: number[]) => setSliderValue(value[0])}
                      className="w-full"
                    />
                    
                    {/* Duration scale labels */}
                    <div className="flex justify-between text-xs text-gray-500 px-1">
                      <span>15 min</span>
                      <span>3 hrs</span>
                      <span>6 hrs</span>
                      <span>9 hrs</span>
                      <span>12 hrs</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Hourly Rate: Rs.{hourlyRate.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Estimated Total</p>
                        <p className="text-2xl font-bold text-blue-600">
                          Rs.{totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Project Details */}
                <div className="space-y-3">
                  <Label htmlFor="projectDetails" className="text-base font-semibold">
                    Project Details
                  </Label>
                  <p className="text-sm text-gray-600">
                    Tell the mentor about your project, goals, and specific areas where you need help
                  </p>
                  <Textarea
                    id="projectDetails"
                    value={projectDetails}
                    onChange={(e) => setProjectDetails(e.target.value)}
                    placeholder="Describe your project, what you want to achieve, specific challenges you're facing, and what you'd like to focus on during the session..."
                    className="min-h-[200px] resize-none"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    {projectDetails.length} characters
                  </p>
                </div>

                <Separator />

                {/* Important Notes */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Important Information
                  </h3>
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>The mentor will review your request and confirm within 24 hours</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>You can cancel or reschedule up to 24 hours before the session</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Payment will be processed after the mentor confirms your booking</span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Submitting...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
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

              {/* Price Breakdown */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 mb-2">Price Breakdown</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Hourly Rate</span>
                    <span className="font-medium">Rs.{hourlyRate.toLocaleString()}</span>
                  </div>
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
                </div>
              </div>

              <Separator />

              {/* Additional Info */}
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span>Session will be scheduled based on mentor availability</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <User className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span>One-on-one personalized mentorship</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
