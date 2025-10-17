"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ServiceDetail } from "@/components/services/ServiceDetail"
import { FloatingChatButton } from "@/components/services/FloatingChatButton"
import { serviceApi } from "@/services/serviceApi"
import { ServiceListing } from "@/types/service"
import { Loader2 } from "lucide-react"

// Extended interface for service detail with mentor info
 interface ServiceDetailData extends ServiceListing {
  subject: string
  duration: number | null
  thumbnailUrl: string
  mentorName?: string
  mentorLevel?: number
  rating?: number
  reviewCount?: number
  mentorBio?: string
  mentorExpertise?: string[]
  mentorTotalStudents?: number
  mentorTotalSessions?: number
  mentorYearsExperience?: number
}

export default function ServicePage() {
  const params = useParams()
  const serviceId = params.serviceId as string
  const [service, setService] = useState<ServiceDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch service data from backend
        const serviceData = await serviceApi.getServiceById(serviceId)
        console.log("Service data: ", serviceData);
        
        
        // TODO: Fetch mentor information from backend when endpoint is available
        // For now, adding mock mentor data
        const serviceWithMentorInfo: ServiceDetailData = {
          ...serviceData,
          subject: (serviceData as any).subject || serviceData.category || 'General',
          duration: (serviceData as any).duration ?? null,
          mentorName: `${serviceData.mentorFirstName} ${serviceData.mentorLastName}`,
          mentorAvatar: `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/${serviceData.mentorAvatar}` || '/image/avatar/default.jpg',
          thumbnailUrl: serviceData.thumbnailUrl || '/image/default_card.jpg',
          mentorLevel: 2,
          rating: 4.8,
          reviewCount: Math.floor(Math.random() * 500) + 100,
          mentorBio: serviceData.mentorBio,
          // mentorExpertise: [serviceData.subject],
          mentorTotalStudents: 150,
          mentorTotalSessions: 500,
          mentorYearsExperience: 5,
        }
        
        setService(serviceWithMentorInfo)
      } catch (error) {
        console.error("Error fetching service:", error)
        setError("Failed to load service details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (serviceId) {
      fetchService()
    }
  }, [serviceId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    )
  }

  if (error || (!loading && !service)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error ? "Error Loading Service" : "Service Not Found"}
          </h1>
          <p className="text-gray-600">
            {error || "The service you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!service) {
    return null
  }

  return (
    <>
      <ServiceDetail service={service} />
      <FloatingChatButton
        mentorId={service.mentorId}
        mentorName={service.mentorName || "Mentor"}
        mentorAvatar={service.mentorAvatar}
      />
    </>
  )
}
