"use client";  // Add this line to mark it as a client component

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { ServiceListCard } from "@/types/serviceListCard"
import { formatDate } from "@/lib/utils"

export function ServiceCard({ service }: { service: ServiceListCard }) {
  // Add some basic validation
  if (!service) {
    console.error("Service data is undefined or null");
    return null;
  }
  
  const {
    title,
    subject,
    description,
    fee,
    rating,
    reviews,
    thumbnail,
    createdAt,
    mentor
  } = service;
  
  // Log for debugging
  console.log("Rendering service card:", { title, subject, fee });

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />)
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
    }

    return stars
  }

  // Format the date from ISO string to a readable format
  const formattedDate = formatDate(createdAt);

  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={thumbnail || "/placeholder.svg"} 
          alt={title} 
          className="w-full h-48 object-cover border-b border-gray-200" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-md border border-gray-200">
          <div className="text-sm font-semibold text-gray-900">${fee}/hr</div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="mb-3">
          <Badge variant="secondary" className="text-blue-600 bg-blue-50 hover:bg-blue-100">
            {subject}
          </Badge>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{title}</h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">{renderStars(rating)}</div>
          <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
          <span className="text-gray-500 text-sm">({reviews} reviews)</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage 
                src={mentor.avatar || "/default-avatar.svg"} 
                alt={mentor.name} 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/default-avatar.svg";
                }}
              />
              <AvatarFallback>
                {mentor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-900">By {mentor.name}</div>
              <div className="text-sm text-gray-500">{mentor.role}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Created</div>
            <div className="text-sm font-medium text-gray-700">{formattedDate}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
