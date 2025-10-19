import { Star, Check, CheckCircle, DollarSign, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import Link from "next/link"
import type { ServiceListing as ServiceListingType, ServiceAvailability } from '@/types/service'


const availabilityModeLabels: Record<string, string> = {
  HOURLY: "Hourly",
  MONTHLY: "Monthly",
  PROJECT_BASED: "Project Based",
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const getAvailabilitySummary = (availabilities: ServiceAvailability[]): string => {
  if (!availabilities || availabilities.length === 0) {
    return "Schedule not set"
  }
  const days = availabilities.map((a) => dayNames[a.dayOfWeek]).slice(0, 3)
  return days.join(", ") + (availabilities.length > 3 ? "..." : "")
}

const getImageUrl = (thumbnailUrl: string | null | undefined): string => {
  if (!thumbnailUrl) return "/image/default_card.jpg"

  if (thumbnailUrl.startsWith("http://") || thumbnailUrl.startsWith("https://")) {
    return thumbnailUrl
  }

  const uploadsIndex = thumbnailUrl.indexOf("uploads/")
  if (uploadsIndex !== -1) {
    const relativePath = thumbnailUrl.substring(uploadsIndex)
    const port = process.env.NEXT_PUBLIC_BACKEND_PORT || "8000"
    return `http://localhost:${port}/${relativePath}`
  }

  return "/image/default_card.jpg"
}

const formatPricing = (pricings: any[]) => {
    if (!pricings || pricings.length === 0) return 'Price on request';
    const prices = pricings
      .map((p) => `${p.pricingType}: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.price)}`)
      .join(', ');
    return prices;
  };

export function ServiceCard({ service }: { service: ServiceListingType }) {
  const rating = 4.8
  const reviewCount = Math.floor(Math.random() * 1000) + 100
  const thumbnailUrl = getImageUrl(service.thumbnailUrl)
  const mentorAvatarUrl = getImageUrl(service.mentorAvatar)
  const availabilitySummary = getAvailabilitySummary(service.availabilities)

  console.log("serrrrr: ", service.pricings);
  
  const minPrice = service.pricings && service.pricings.length > 0
    ? Math.min(...service.pricings.map((p) => p.price))
    : 0

  const modeLabel = service.availabilityModes && service.availabilityModes.length > 0
    ? (availabilityModeLabels[service.availabilityModes[0]] || service.availabilityModes[0])
    : "—"

  const displayName = (service.mentorFirstName || service.mentorLastName)
    ? `${service.mentorFirstName || ""} ${service.mentorLastName || ""}`.trim()
    : "Expert Mentor"
  const formatPricingType = (type: string) => {
    return type.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };
  return (
    <Link href={`/services/${service.serviceId}`}>
  <Card className="group bg-white border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col rounded-lg w-full sm:w-80 md:w-96">
        {/* Thumbnail Image */}
  <div className="relative h-44 sm:h-52 md:h-56 bg-gray-100 overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Card Content */}
        <div className="p-3 flex flex-col flex-grow">
          {/* Mentor Info */}
          <div className="flex items-center gap-2 mb-2" onClick={() => { window.location.href = `/mentor/${service.mentorId}` }}>
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

          {/* Category */}
          {(service.category || (service.expertiseAreas && service.expertiseAreas.length > 0)) && (
            <div className="mb-1.5 flex items-center gap-2 flex-wrap">
              {service.category && (
                <Badge variant="outline" className="text-xs font-medium text-blue-600 border-blue-200 bg-blue-50">
                  {service.category}
                </Badge>
              )}
            </div>
          )}

          {/* Service Title */}
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 mb-1.5 leading-snug group-hover:text-primary transition-colors">
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

          {/* What You Get */}
        {service.whatYouGet && service.whatYouGet.length > 0 && (
          <div className="mb-4 bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">What You Get:</p>
            <ul className="space-y-1">
              {service.whatYouGet.slice(0, 2).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs">
                  <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item.title}</span>
                </li>
              ))}
              {service.whatYouGet.length > 2 && (
                <li className="text-xs text-gray-600 pt-1">
                  +{service.whatYouGet.length - 2} more benefits
                </li>
              )}
            </ul>
          </div>
        )}
          {/* Spacer to push footer to bottom */}
          <div className="flex-grow"></div>

          {/* Footer with Price and meta */}
          <div className="pt-2 mt-2 border-t border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Pricing Options</span>
                <div className="flex flex-wrap gap-2">
            {service.pricings && service.pricings.map((pricing) => (
              <Badge key={pricing.pricingId} variant="secondary" className="gap-1">
                <Clock className="w-3 h-3" />
                {formatPricingType(pricing.pricingType)}: ${pricing.price}
              </Badge>
            ))}
          </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
