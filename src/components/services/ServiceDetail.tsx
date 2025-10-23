"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Star, 
  Clock, 
  Calendar, 
  MapPin, 
  Heart, 
  Share2, 
  CheckCircle,
  Info,
  Award,
  Users,
  User,
  BookOpen,
  Video
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Description } from "@radix-ui/react-dialog"

interface Availability {
  dayOfWeek: number
  startTime: string
  endTime: string
}

interface ServiceDetailProps {
  serviceId: string
  title: string
  subject: string
  description: string
  createdAt: string
  updatedAt: string
  mentorId: string
  thumbnailUrl: string
  availabilityModes?: string[]
  duration: number | null
  mentorName?: string
  mentorAvatar?: string
  mentorLevel?: number
  rating?: number
  reviewCount?: number
  mentorBio?: string
  mentorExpertise?: string[]
  mentorTotalStudents?: number
  mentorTotalSessions?: number
  mentorYearsExperience?: number
  pricings?: { pricingId?: string; pricingType: string; price: number }[]
  whatYouGet?: Array<{ title: string; description: string }>
}

const serviceTypeLabels = {
  "video-session": "Video Session",
  chat: "Chat Disscussion",
  mixed: "Video Session & Chat",
}


const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const availabilityModeLabels: Record<string, string> = {
  HOURLY: "Hourly",
  MONTHLY: "Monthly",
  PROJECT_BASED: "Project Based",
}

// Metadata for nicer chips: icon, label, colors and short description
const availabilityModeMeta: Record<string, { label: string; colorClass: string; icon?: any; description?: string }> = {
  HOURLY: { label: "Hourly", colorClass: "bg-green-50 text-green-700", icon: Clock, description: "Book this mentor by the hour" },
  MONTHLY: { label: "Monthly", colorClass: "bg-blue-50 text-blue-700", icon: Calendar, description: "Monthly recurring mentorship" },
  PROJECT_BASED: { label: "Project Based", colorClass: "bg-purple-50 text-purple-700", icon: Award, description: "Project-based work with milestone pricing" },
}

export function ServiceDetail({ service }: { service: ServiceDetailProps }) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const rating = service.rating || 4.8
  const reviewCount = service.reviewCount || 234
  const mentorLevel = service.mentorLevel || 2
  const thumbnailUrl = "/image/default_card.jpg"
  

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service.title,
        text: service.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 mt-15">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Image */}
            <Card className="overflow-hidden">
              <div className="relative h-96 bg-gray-200">
                <img
                  src={`${service.thumbnailUrl}` || '/image/default_card.jpg'}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white shadow-lg"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5 text-gray-700" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Service Info Card */}
            <Card>
              <CardContent className="p-6">
                {/* Subject Badge */}
                {service.subject && (
                  <div className="mb-4">
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-sm px-3 py-1">
                      {service.subject.toUpperCase()}
                    </Badge>
                  </div>
                )}

                {/* Title and Rating */}
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-bold text-gray-900">
                        {rating.toFixed(1)}
                      </span>
                      <span className="text-gray-600">
                        ({reviewCount} reviews)
                      </span>
                    </div>
                    <Separator orientation="vertical" className="h-5" />
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    About This Service
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {service.description}
                  </p>
                </div>

                <Separator className="my-6" />

                {/* Key Features */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    What You'll Get
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.whatYouGet?.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900">{item.title}</p>
                                <p className="text-sm text-gray-600">
                                {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Availability Schedule */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Availability Schedule
                  </h2>
                  {/* Availability Modes chips */}
                  {service.availabilityModes && service.availabilityModes.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {service.availabilityModes.map((m) => {
                        const meta = availabilityModeMeta[m] || { label: availabilityModeLabels[m] || m, colorClass: 'bg-gray-100 text-gray-700' }
                        const Icon = meta.icon
                        return (
                          <div
                            key={m}
                            title={meta.description}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full ${meta.colorClass}`}
                          >
                            {Icon ? <Icon className="w-4 h-4" /> : null}
                            <span className="text-xs font-medium">{meta.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Separator className="my-6" />
            
            {/* Mentor Profile Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  About Your Mentor
                </h2>

                <div className="flex items-start gap-6 mb-6">
                  <Avatar className="w-24 h-24 border-4 border-blue-200 cursor-pointer" onClick={() => { window.location.href = `/mentor/${service.mentorId}` }}>
                    <AvatarImage src={service.mentorAvatar} alt={service.mentorName} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-2xl">
                      {service.mentorName?.charAt(0) || "M"}
                    </AvatarFallback>
                  </Avatar>
                  

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 cursor-pointer" onClick={() => { window.location.href = `/mentor/${service.mentorId}` }}>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {service.mentorName || "Expert Mentor"}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
                      <span className="text-gray-600">({reviewCount} reviews)</span>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-4">
                      {service.mentorBio ||
                        "Experienced professional dedicated to helping students achieve their goals through personalized guidance and support."}
                    </p>

                    {/* Mentor Stats */}
                    {/* <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-gray-900">
                          {service.mentorTotalStudents || 150}
                        </p>
                        <p className="text-sm text-gray-600">Students</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <BookOpen className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-gray-900">
                          {service.mentorTotalSessions || 500}+
                        </p>
                        <p className="text-sm text-gray-600">Sessions</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <Award className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-gray-900">
                          {service.mentorYearsExperience || 5}+
                        </p>
                        <p className="text-sm text-gray-600">Years Exp.</p>
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Expertise Tags */}
                {service.mentorExpertise && service.mentorExpertise.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Areas of Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {service.mentorExpertise.map((skill, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="border rounded-lg p-4 bg-white flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-gray-700">Pricing</h3>
                    {service.pricings && service.pricings.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2">
                        {service.pricings.map((p) => (
                          <div key={p.pricingId || p.pricingType} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{p.pricingType.charAt(0).toUpperCase() + p.pricingType.slice(1).replace('-', ' ')}</span>
                            <span className="text-lg font-bold text-gray-900">Rs. {p.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">No pricing set for this service.</p>
                    )}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-medium text-gray-900">Within 24h</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg mb-3 cursor-pointer"
                  onClick={() => router.push(`/services/${service.serviceId}/book`)}
                >
                  Book Session Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
