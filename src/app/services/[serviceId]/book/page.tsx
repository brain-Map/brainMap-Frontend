"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { serviceApi } from "@/services/serviceApi"
import { ServiceListing } from "@/types/service"
import { Loader2 } from "lucide-react"
import { BookingForm } from "@/components/services/BookingForm"

// Extended interface for service detail with mentor info
interface ServiceDetailData extends ServiceListing {
  mentorName?: string
  hourlyRate?: number
  mentorAvatar?: string
}

export default function BookSessionPage() {
  const params = useParams()
  const router = useRouter()
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
        
        
        // Map backend response to the service shape expected by BookingForm
        const backendAvatar = serviceData.mentorAvatar
        const mentorAvatar = backendAvatar
          ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL || `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT || 3000}`}/${backendAvatar}`
          : '/image/avatar/default.jpg'

        const serviceWithMentorInfo: ServiceDetailData = {
          ...serviceData,
          mentorName: `${serviceData.mentorFirstName || ''} ${serviceData.mentorLastName || ''}`.trim(),
          mentorAvatar,
          // Use fee as fallback hourlyRate if pricing not provided
          hourlyRate: (serviceData as any).fee || undefined,
          // pass through availabilityModes and pricings as returned by backend
          // (BookingForm expects properties like `availabilityModes`, `pricings`, `availabilities`)
          availabilityModes: serviceData.availabilityModes || [],
          pricings: serviceData.pricings || [],
          availabilities: serviceData.availabilities || [],
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
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {service && <BookingForm service={service} />}
      </div>
    </div>
  )
}
