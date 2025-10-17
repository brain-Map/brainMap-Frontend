"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ServiceCard } from "@/components/services/ServiceCard"
import { ServiceFilters } from "@/components/services/ServiceFilters"
import { serviceApi } from "@/services/serviceApi"
import { ServiceListing, ServiceListingsResponse } from "@/types/service"

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(0)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null)
  const [services, setServices] = useState<ServiceListing[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const pageSize = 20
console.log(sessionStorage.getItem("accessToken"));

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        setError(null)
        const response: ServiceListingsResponse = await serviceApi.getAllServiceListings(
          page,
          pageSize,
          'serviceId'
        )
        const servicesWithMentorInfo = response.content.map(service => ({
          ...service,
          mentorLevel: Math.floor(Math.random() * 3) + 1,
          rating: 4.5 + Math.random() * 0.5,
          reviewCount: Math.floor(Math.random() * 900) + 100,
        }))
        setServices(servicesWithMentorInfo)
        setTotalPages(response.totalPages)
        console.log(response.content);
        
      } catch (err) {
        console.error('Error fetching services:', err)
        setError('Failed to load services. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [page])

  // Client-side filtering for search and filters
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = !selectedSubject || service.category === selectedSubject

    return matchesSearch && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 mt-15">
      {/* Hero Section */}
      <section className="relative border-b border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Expert <span className="text-blue-600">Mentorship Services</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Connect with expert mentors across various subjects and accelerate your learning journey.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-72 flex-shrink-0">
            <div className="sticky top-6">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-lg"
                  />
                </div>
              </div>

              <ServiceFilters
                selectedSubject={selectedSubject}
                selectedServiceType={selectedServiceType}
                onSubjectChange={setSelectedSubject}
                onServiceTypeChange={setSelectedServiceType}
              />
            </div>
          </aside>

          {/* Services Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Loading services...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">⚠️</div>
                <p className="text-red-500 font-semibold">{error}</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{filteredServices.length.toLocaleString()}</span> services available
                  </p>
                </div>

                {filteredServices.length === 0 ? (
                  <div className="text-center py-20 bg-white border border-gray-200 rounded-lg">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-600 font-medium text-lg">No services found matching your criteria.</p>
                    <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                      <ServiceCard key={service.serviceId} service={service} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0 || loading}
                      className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Previous
                    </button>
                    <div className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg">
                      Page {page + 1} of {totalPages}
                    </div>
                    <button
                      onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                      disabled={page === totalPages - 1 || loading}
                      className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
