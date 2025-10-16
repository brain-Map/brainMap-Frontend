import { Star, Calendar, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import Link from "next/link"
import type { ServiceListing as ServiceListingType, ServiceAvailability } from '@/types/service'

interface Availability {
  dayOfWeek: number
  startTime: string
  endTime: string
}

interface Pricing {
  pricingId: string
  pricingType: string
  price: number
}

interface WhatYouGetItem {
  title: string
  description?: string
}


const availabilityModeLabels: Record<string, string> = {
  HOURLY: "Hourly",
  MONTHLY: "Monthly",
  PROJECT_BASED: "Project Based",
}

const levelBadgeColors = {
  1: "bg-gray-100 text-gray-700",
  2: "bg-blue-100 text-blue-700",
  3: "bg-purple-100 text-purple-700",
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Helper to get availability summary
const getAvailabilitySummary = (availabilities: ServiceAvailability[]): string => {
  if (!availabilities || availabilities.length === 0) {
    return "Schedule not set"
  }
  const days = availabilities.map((a) => dayNames[a.dayOfWeek]).slice(0, 3)
  return days.join(", ") + (availabilities.length > 3 ? "..." : "")
}

// Helper function to convert backend file path to URL
const getImageUrl = (thumbnailUrl: string | null | undefined): string => {
  if (!thumbnailUrl) return "/image/default_card.jpg"

  // If it's already a URL (starts with http:// or https://), return as is
  if (thumbnailUrl.startsWith("http://") || thumbnailUrl.startsWith("https://")) {
    return thumbnailUrl
  }

  // If it's a backend file path, convert it to URL
  const uploadsIndex = thumbnailUrl.indexOf("uploads/")
  if (uploadsIndex !== -1) {
    const relativePath = thumbnailUrl.substring(uploadsIndex)
    // Use NEXT_PUBLIC_BACKEND_PORT if available, otherwise default to 8000
    const port = process.env.NEXT_PUBLIC_BACKEND_PORT || "8000"
    return `http://localhost:${port}/${relativePath}`
  }

  return "/image/default_card.jpg"
}

const formatTimeRange = (startTime?: string, endTime?: string) => {
  if (!startTime && !endTime) return ""
  return `${startTime ?? ""}${startTime && endTime ? " - " : ""}${endTime ?? ""}`
}

const formatDate = (iso?: string) => {
  if (!iso) return ""
  try {
    return new Date(iso).toLocaleString()
  } catch (e) {
    return iso
  }
}

export function ServiceCard({ service }: { service: ServiceListingType }) {
  const [isFavorite, setIsFavorite] = useState(false)
  // derive display values from backend shape
  const rating = 4.8
  const reviewCount = Math.floor(Math.random() * 1000) + 100
  const thumbnailUrl = getImageUrl(service.thumbnailUrl)
  const mentorAvatarUrl = getImageUrl(service.mentorAvatar)
  const availabilitySummary = getAvailabilitySummary(service.availabilities)

  // compute min price from pricings
  const minPrice = service.pricings && service.pricings.length > 0
    ? Math.min(...service.pricings.map((p) => p.price))
    : 0

  const modeLabel = service.availabilityModes && service.availabilityModes.length > 0
    ? (availabilityModeLabels[service.availabilityModes[0]] || service.availabilityModes[0])
    : "—"

  const displayName = (service.mentorFirstName || service.mentorLastName)
    ? `${service.mentorFirstName || ""} ${service.mentorLastName || ""}`.trim()
    : "Expert Mentor"

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
        </div>

        {/* Card Content */}
        <div className="p-3 flex flex-col flex-grow">
          {/* Mentor Info */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden flex-shrink-0 border-2 border-blue-200">
              {mentorAvatarUrl ? (
                <img
                  src={mentorAvatarUrl}
                  alt="Mentor"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500" />
              )}
            </div>
            <span className="text-sm font-semibold text-gray-800 truncate">
              {displayName}
            </span>
          </div>

          {/* Category & expertise */}
          {(service.category || (service.expertiseAreas && service.expertiseAreas.length > 0)) && (
            <div className="mb-1.5 flex items-center gap-2 flex-wrap">
              {service.category && (
                <Badge variant="outline" className="text-xs font-medium text-blue-600 border-blue-200 bg-blue-50">
                  {service.category}
                </Badge>
              )}
              {service.expertiseAreas && service.expertiseAreas.slice(0, 2).map((e) => (
                <Badge key={e} className="text-xs font-medium bg-gray-100 text-gray-700">
                  {e.replace(/-/g, ' ')}
                </Badge>
              ))}

              {/* Availability Modes */}
              {service.availabilityModes && service.availabilityModes.length > 0 && (
                service.availabilityModes.map((m) => (
                  <Badge key={m} className="text-xs font-medium bg-green-50 text-green-700">
                    {availabilityModeLabels[m] || m}
                  </Badge>
                ))
              )}
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

          {/* What you get */}
          {service.whatYouGet && service.whatYouGet.length > 0 && (
            <ul className="text-xs text-gray-600 mb-2 list-disc pl-4">
              {service.whatYouGet.map((w, idx) => (
                <li key={idx} className="truncate">
                  <span className="font-medium">{w.title}</span>
                  {w.description ? <span className="text-gray-500"> — {w.description}</span> : null}
                </li>
              ))}
            </ul>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-gray-900">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({reviewCount.toLocaleString()})</span>
          </div>

          {/* Service Details */}
          <div className="flex flex-row justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <div>
                <div>{availabilitySummary}</div>
                {service.availabilities && service.availabilities.length > 0 && (
                  <div className="text-[11px] text-gray-500">
                    {service.availabilities.slice(0, 3).map((a, i) => (
                      <div key={i}>{`${dayNames[a.dayOfWeek]} ${formatTimeRange(a.startTime, a.endTime)}`}</div>
                    ))}
                    {service.availabilities.length > 3 ? <div>...</div> : null}
                  </div>
                )}
              </div>
            </div>
          
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>{modeLabel}</span>
            </div>
          </div>

          {/* Spacer to push footer to bottom */}
          <div className="flex-grow"></div>

          {/* Footer with Price and meta */}
          <div className="pt-2 mt-2 border-t border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Starting from</span>
                <span className="text-xl font-bold text-blue-900">Rs. {minPrice || "0"}</span>
              </div>

              {/* Pricings summary */}
              <div className="flex items-center gap-2">
                {service.pricings && service.pricings.slice(0, 3).map((p) => (
                  <Badge key={p.pricingId ?? `${p.pricingType}-${p.price}`} className="text-xs bg-gray-100 text-gray-800">
                    {`${p.pricingType.replace(/-/g, ' ')} • Rs. ${p.price}`}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-gray-500 flex items-center justify-between">
              <div>
                <div>Created: {formatDate(service.createdAt)}</div>
                <div>Updated: {formatDate(service.updatedAt)}</div>
              </div>

              {/* Mentor bio small */}
              <div className="max-w-xs text-right text-[12px] text-gray-600">
                {service.mentorBio ? (
                  <div className="line-clamp-3">{service.mentorBio}</div>
                ) : (
                  <div className="text-gray-400">No mentor bio</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
