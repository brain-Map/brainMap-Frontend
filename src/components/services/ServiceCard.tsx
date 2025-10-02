import { Heart, Star, Clock, Calendar, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import Link from "next/link"

interface Availability {
  dayOfWeek: number
  startTime: string
  endTime: string
}

interface ServiceListing {
  serviceId: string
  title: string
  subject: string
  description: string
  fee: number | null
  createdAt: string
  updatedAt: string
  mentorId: string
  availabilities: Availability[]
  thumbnailUrl: string
  duration: number | null
  serviceType: "video-session" | "chat" | "mixed"
  mentorFirstName?: string
  mentorLastName?: string
  mentorAvatar?: string
  mentorLevel?: number
  rating?: number
  reviewCount?: number
  minPrice?: number
}

const serviceTypeLabels = {
  "video-session": "Video Session",
  chat: "Chat Disscussion",
  mixed: "Video Session & Chat",
}

const levelBadgeColors = {
  1: "bg-gray-100 text-gray-700",
  2: "bg-blue-100 text-blue-700",
  3: "bg-purple-100 text-purple-700",
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Helper to get availability summary
const getAvailabilitySummary = (availabilities: Availability[]): string => {
  if (!availabilities || availabilities.length === 0) {
    return "Schedule not set"
  }
  const days = availabilities.map((a) => dayNames[a.dayOfWeek]).slice(0, 3)
  return days.join(", ") + (availabilities.length > 3 ? "..." : "")
}

// Helper function to convert backend file path to URL
const getImageUrl = (thumbnailUrl: string | null | undefined): string => {
  if (!thumbnailUrl) {
    return "/image/default_card.jpg"
  }
  
  // If it's already a URL (starts with http:// or https://), return as is
  if (thumbnailUrl.startsWith('http://') || thumbnailUrl.startsWith('https://')) {
    return thumbnailUrl
  }
  
  // If it's a backend file path, convert it to URL
  // Extract the path after "uploads/"
  const uploadsIndex = thumbnailUrl.indexOf('uploads/')
  if (uploadsIndex !== -1) {
    const relativePath = thumbnailUrl.substring(uploadsIndex)
    return `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/${relativePath}`
  }
  
  // If path format is unexpected, return default
  return "/image/default_card.jpg"
}

export function ServiceCard({ service }: { service: ServiceListing }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const rating = service.rating || 4.8
  const reviewCount = service.reviewCount || Math.floor(Math.random() * 1000) + 100
  const mentorLevel = service.mentorLevel || 2
  const thumbnailUrl = getImageUrl(service.thumbnailUrl) || "/image/default_card.jpg"
  const availabilitySummary = getAvailabilitySummary(service.availabilities)

  return (
    <Link href={`/services/${service.serviceId}`}>
      <Card className="group bg-white border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col rounded-lg w-full">
        {/* Thumbnail Image */}
        <div className="relative h-50 bg-gray-100 overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Service Type Badge - Overlay */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="text-xs font-medium bg-white/95 text-gray-800 border-0 shadow-sm">
              {serviceTypeLabels[service.serviceType]}
            </Badge>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-3 flex flex-col flex-grow">
          {/* Mentor Info */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden flex-shrink-0 border-2 border-blue-200">
              {service.mentorAvatar ? (
                <img
                  src={`http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/${service.mentorAvatar}` || "/image/avatar/default.jpg"}
                  alt="Mentor"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500" />
              )}
            </div>
            <span className="text-xs font-semibold text-gray-800 truncate">
              {service.mentorFirstName + " " + service.mentorLastName || "Expert Mentor"}
            </span>
            <Badge 
              className={`ml-auto text-xs font-semibold px-1.5 py-0 ${
                levelBadgeColors[mentorLevel as keyof typeof levelBadgeColors] || levelBadgeColors[2]
              }`}
            >
              Level {mentorLevel}
            </Badge>
          </div>

          {/* Subject Badge */}
          {service.subject && (
            <div className="mb-1.5">
              <Badge variant="outline" className="text-xs font-medium text-blue-600 border-blue-200 bg-blue-50">
                {service.subject}
              </Badge>
            </div>
          )}

          {/* Service Title */}
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 mb-1.5 leading-snug group-hover:text-blue-900 transition-colors">
            {service.title}
          </h3>

          {/* Description Preview */}
          <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">
            {service.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-gray-900">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({reviewCount.toLocaleString()})</span>
          </div>

          {/* Service Details */}
          <div className="flex flex-row justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{service.duration || 60} min session</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{availabilitySummary}</span>
            </div>
          
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>{serviceTypeLabels[service.serviceType]}</span>
            </div>
          </div>

          {/* Spacer to push footer to bottom */}
          <div className="flex-grow"></div>

          {/* Footer with Price */}
          <div className="pt-2 mt-2 border-t border-gray-200 h-12 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wide">
                Starting from
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-blue-900">Rs. {service.minPrice || "0"}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
