"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Filter,
  Search,
  MoreVertical,
  Video,
  MessageSquare,
  DollarSign,
  Mail,
  Phone,
  Package
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import toast from "react-hot-toast"
// import { BookingRequest } from "@/types/booking"
// import { bookingApi } from "@/services/bookingApi"
import { DomainExpertRequest } from "@/types/booking"


export default function AppointmentRequestsPage() {
  const { user } = useAuth()
  // Remove old bookings state, use requests only
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [loading, setLoading] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<DomainExpertRequest | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // For adjustment, update, and reason
  const [acceptAdjustment, setAcceptAdjustment] = useState({ price: '', date: '', time: '' })
  const [updateFields, setUpdateFields] = useState({ price: '', date: '', time: '', description: '' })
  const [rejectReason, setRejectReason] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showRejectConfirm, setShowRejectConfirm] = useState(false)

  const [requests, setRequests] = useState<DomainExpertRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<DomainExpertRequest[]>([])

  // Filter requests based on tab and search
  useEffect(() => {
    let filtered = requests

    // Filter by status
    if (activeTab !== "all") {
      filtered = filtered.filter(request => request.status.toLowerCase() === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        request =>
          (`${request.userFirstName} ${request.userLastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.userEmail.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort requests
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "date":
          return new Date(a.requestedDate).getTime() - new Date(b.requestedDate).getTime()
        case "price":
          return b.totalPrice - a.totalPrice
        default:
          return 0
      }
    })

    setFilteredRequests(filtered)
  }, [requests, activeTab, searchQuery, sortBy])

  // Remove fetchBookings, only use fetchRequests

  // Fetch requests from backend
  const fetchRequests = async () => {
    setLoading(true)
    try {
      const expertId = user?.id // Adjust based on your auth context
      const response = await fetch(`http://localhost:8080/api/v1/domain-experts/${expertId}/bookings`)
      if (!response.ok) throw new Error("Failed to fetch requests")
      const data = await response.json()
    console.log(data);
    
      setRequests(Array.isArray(data) ? data : [data])
    } catch (error) {
      console.error("Error fetching requests:", error)
      toast.error("Failed to load appointment requests")
    } finally {
      setLoading(false)
    }
  }

  // Load requests on mount
  useEffect(() => {
    fetchRequests()
  }, [])

  // Handle status update
  const handleStatusUpdate = async (
    requestId: string,
    newStatus: "accepted" | "rejected" | "completed" | "canceled" | "updated",
    adjustment?: { price?: string; date?: string; time?: string; description?: string },
    reason?: string
  ) => {
    setCancelReason("")
    setUpdateFields({ price: "", date: "", time: "", description: "" })
    setLoading(true)
    try {
      let url = ""
      let body: any = {}
      if (newStatus === "accepted") {
        url = `http://localhost:8080/api/v1/service-listings/service-booking/${requestId}/accept`
        if (adjustment) {
          if (adjustment.price) body.price = Number(adjustment.price)
          if (adjustment.date) body.date = adjustment.date
          if (adjustment.time) body.time = adjustment.time
        }
      } else if (newStatus === "updated") {
        url = `http://localhost:8080/api/v1/service-listings/service-booking/${requestId}/update`
        if (adjustment) {
          if (adjustment.price) body.price = Number(adjustment.price)
          if (adjustment.date) body.date = adjustment.date
          if (adjustment.time) body.time = adjustment.time
          if (adjustment.description) body.description = adjustment.description
        }
      } else if (newStatus === "completed") {
        url = `http://localhost:8080/api/v1/service-listings/service-booking/${requestId}/complete`
      } else if (newStatus === "rejected") {
        url = `http://localhost:8080/api/v1/service-listings/service-booking/${requestId}/reject`
        if (reason) body.reason = reason
      } else if (newStatus === "canceled") {
        url = `http://localhost:8080/api/v1/service-listings/service-booking/${requestId}/cancel`
        if (reason) body.reason = reason
      }
      // Get token from user context
      const token = localStorage.getItem("accessToken")
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: Object.keys(body).length ? JSON.stringify(body) : undefined,
      })
      if (!response.ok) throw new Error("Failed to update appointment status")
      // Simulate update locally
      setRequests((prev) =>
        prev.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: newStatus,
                updatedAt: new Date().toISOString(),
                ...(body.price ? { totalPrice: body.price } : {}),
                ...(body.date ? { requestedDate: body.date } : {}),
                ...(body.time ? { requestedStartTime: body.time } : {}),
              }
            : request
        )
      )
      if (selectedBooking?.id === requestId) {
        setSelectedBooking((prev: DomainExpertRequest | null) =>
          prev
            ? {
                ...prev,
                status: newStatus,
                updatedAt: new Date().toISOString(),
                ...(body.price ? { totalPrice: body.price } : {}),
                ...(body.date ? { requestedDate: body.date } : {}),
                ...(body.time ? { requestedStartTime: body.time } : {}),
              }
            : null
        )
      }
      toast.success(`Appointment ${newStatus} successfully!`)
    } catch (error) {
      console.error("Error updating request status:", error)
      toast.error("Failed to update appointment status")
    } finally {
      setLoading(false)
      setAcceptAdjustment({ price: "", date: "", time: "" })
      setRejectReason("")
    }
  }

  // Handle view details
  const handleViewDetails = (request: DomainExpertRequest) => {
    setSelectedBooking(request)
    setIsDetailModalOpen(true)
    setAcceptAdjustment({ price: '', date: '', time: '' })
    setRejectReason('')
    setShowUpdateModal(false)
    setShowCancelModal(false)
    setShowCancelConfirm(false)
    setShowRejectConfirm(false)
  }

  // Handle close modal
  const handleCloseModal = () => {
    setIsDetailModalOpen(false)
    setShowUpdateModal(false)
    setShowCancelModal(false)
    setShowCancelConfirm(false)
    setShowRejectConfirm(false)
    setTimeout(() => setSelectedBooking(null), 200)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 border border-yellow-300" },
      accepted: { label: "Accepted", color: "bg-green-100 text-green-800 border border-green-300" },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-800 border border-red-300" },
      confirmed: { label: "Confirmed", color: "bg-indigo-100 text-indigo-800 border border-indigo-300" },
      completed: { label: "Completed", color: "bg-blue-100 text-blue-800 border border-blue-300" },
      cancel: { label: "Cancelled", color: "bg-gray-100 text-gray-800 border border-gray-300" },
      updated: { label: "Updated", color: "bg-orange-100 text-orange-800 border border-orange-300" },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <Badge className={config ? config.color + " px-3 py-1 rounded-full text-xs font-semibold" : "bg-gray-100 text-gray-800 border border-gray-300 px-3 py-1 rounded-full text-xs font-semibold"}>
        {config ? config.label : status}
      </Badge>
    )
  }

  // Get service type icon
  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case "video-session":
        return <Video className="w-4 h-4" />
      case "chat":
        return <MessageSquare className="w-4 h-4" />
      case "mixed":
        return (
          <div className="flex gap-1">
            <Video className="w-3 h-3" />
            <MessageSquare className="w-3 h-3" />
          </div>
        )
      default:
        return null
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Calculate statistics
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status.toLowerCase() === "pending").length,
    accepted: requests.filter(r => r.status.toLowerCase() === "accepted").length,
    rejected: requests.filter(r => r.status.toLowerCase() === "rejected").length,
    confirmed: requests.filter(r => r.status.toLowerCase() === "confirmed").length,
    completed: requests.filter(r => r.status.toLowerCase() === "completed").length,
    cancel: requests.filter(r => r.status.toLowerCase() === "cancel").length,
    updated: requests.filter(r => r.status.toLowerCase() === "updated").length,
    totalRevenue: requests
      .filter(r => r.status.toLowerCase() === "completed")
      .reduce((sum, r) => sum + r.totalPrice, 0),
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointment Requests</h1>
            <p className="text-gray-600 mt-1">Manage your student booking requests</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    Rs.{stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by student name, email, or service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="date">By Appointment Date</SelectItem>
                  <SelectItem value="price">By Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs and Requests List */}
        <Card>
          <CardHeader>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="all">
                  All ({requests.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({stats.pending})
                </TabsTrigger>
                <TabsTrigger value="accepted">
                  Accepted ({stats.accepted})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({stats.rejected})
                </TabsTrigger>
                <TabsTrigger value="confirmed">
                  Confirmed ({stats.confirmed})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({stats.completed})
                </TabsTrigger>
                <TabsTrigger value="cancel">
                  Cancelled ({stats.cancel})
                </TabsTrigger>
                <TabsTrigger value="updated">
                  Updated ({stats.updated})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No appointment requests found
                    </h3>
                    <p className="text-gray-600">
                      {searchQuery
                        ? "Try adjusting your search criteria"
                        : "You don't have any appointment requests yet"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRequests.map((request) => ( request.status.toLowerCase() != "canceled" && (
                      <Card 
                        key={request.id} 
                        className="bg-white border-2 border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer"
                        onClick={() => handleViewDetails(request)}
                      >
                        <CardContent className="pt-6">
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* Student Info */}
                            <div className="flex items-start gap-4 flex-1">
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={request.userAvatar} />
                                <AvatarFallback>
                                  {`${request.userFirstName} ${request.userLastName}`.split(" ").map((n: string) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                      {request.userFirstName ? `${request.userFirstName} ${request.userLastName}` : request.username}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                      <div className="flex items-center gap-1">
                                        <Mail className="w-4 h-4" />
                                        {request.userEmail}
                                      </div>
                                    </div>
                                  </div>
                                  {getStatusBadge(request.status.toLowerCase())}
                                </div>

                                <div className="space-y-2 mt-4">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Package className="w-4 h-4 text-gray-500" />
                                    <span className="font-medium text-gray-900">
                                      {request.serviceTitle}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4 text-gray-500" />
                                      <span className="text-gray-700">
                                        {formatDate(request.requestedDate)}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Clock className="w-4 h-4 text-gray-500" />
                                      <span className="text-gray-700">{request.requestedStartTime}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Clock className="w-4 h-4 text-gray-500" />
                                      <span className="text-gray-700">
                                        {request.duration} hour{request.duration !== 1 ? "s" : ""}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <DollarSign className="w-4 h-4 text-gray-500" />
                                      <span className="font-semibold text-green-700">
                                        Rs.{request.totalPrice.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="mt-3">
                                    <p className="text-sm text-gray-600 font-medium mb-1">
                                      Project Details:
                                    </p>
                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                      {request.projectDetails}
                                    </p>
                                  </div>

                                  <div className="text-xs text-gray-500 mt-2">
                                    Requested on {formatDate(request.createdAt)}
                                    {request.updatedAt && ` • Updated ${formatDate(request.updatedAt)}`}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex lg:flex-col gap-2 lg:items-end">
                              {/* Mentor actions */}
                              {request.status.toLowerCase() === "pending" && (
                                <>
                                  <Button
                                    onClick={e => {
                                      e.stopPropagation();
                                      setSelectedBooking(request);
                                      setShowUpdateModal(true);
                                    }}
                                    disabled={loading}
                                    className="bg-orange-500 hover:bg-orange-600 flex-1 lg:flex-none"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Update
                                  </Button>
                                  <Button
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleStatusUpdate(request.id, "accepted");
                                    }}
                                    disabled={loading}
                                    className="bg-green-600 hover:bg-green-700 flex-1 lg:flex-none"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Accept
                                  </Button>
                                  <Button
                                    onClick={e => {
                                      e.stopPropagation();
                                      setSelectedBooking(request);
                                      setRejectReason("");
                                      setShowUpdateModal(false);
                                      setShowRejectConfirm(true);
                                    }}
                                    disabled={loading}
                                    variant="destructive"
                                    className="flex-1 lg:flex-none"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                  </Button> 
                                </>
                              )}
                              {request.status.toLowerCase() === "confirmed" && (
                                <>
                                  <Button
                                    onClick={e => {
                                      e.stopPropagation()
                                      handleStatusUpdate(request.id, "completed")
                                    }}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 flex-1 lg:flex-none"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark as Complete
                                  </Button>
                                  
                                </>
                              )}


                              {request.status.toLowerCase() === "confirmed" ||  request.status.toLowerCase() === "accepted" &&(
                                <Button
                                    onClick={e => {
                                      e.stopPropagation()
                                      setSelectedBooking(request)
                                      setShowCancelConfirm(true)
                                    }}
                                    disabled={loading}
                                    variant="outline"
                                    className="flex-1 lg:flex-none border border-gray-400"
                                  >
                                    <XCircle className="w-4 h-4 mr-2 text-gray-600" />
                                    Cancel
                                  </Button>
                              )}
                              {request.status.toLowerCase() === "completed" && (
                                <Button 
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Completed
                                </Button>
                              )}

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Message Student
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Reschedule
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewDetails(request)
                                  }}>
                                    <FileText className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>

        {/* Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedBooking && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center w-full">
                    Appointment Request Details
                  </DialogTitle>
                  <DialogDescription className="text-center w-full">
                    Request ID: {selectedBooking.id}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4 px-2 md:px-8">
                  {/* Status Badge */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">Status</h3>
                    {getStatusBadge(selectedBooking.status.toLowerCase())}
                  </div>
                  <Separator />
                  {/* Student Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Student Information</h3>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <Avatar className="w-20 h-20 mx-auto">
                        <AvatarImage src={selectedBooking.userAvatar} />
                        <AvatarFallback className="text-xl">
                          {selectedBooking.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-center md:text-left">
                        <h4 className="text-xl font-semibold text-gray-900">
                          {selectedBooking.userFirstName ? `${selectedBooking.userFirstName} ${selectedBooking.userLastName}`: selectedBooking.username}
                        </h4>
                        <div className="space-y-2 mt-3">
                          <div className="flex items-center gap-2 text-gray-700 justify-center md:justify-start">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <a 
                              href={`mailto:${selectedBooking.userEmail}`} 
                              className="hover:text-blue-600"
                            >
                              {selectedBooking.userEmail}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 justify-center md:justify-start">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">ID: {selectedBooking.userId}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  {/* Service Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Service Details</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-blue-600 mt-1" />
                          <div>
                            <p className="font-semibold text-gray-900">{selectedBooking.serviceTitle}</p>
                            <p className="text-sm text-gray-600 mt-1">Service ID: {selectedBooking.serviceId}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getServiceTypeIcon(selectedBooking.serviceType)}
                          <span className="text-sm text-gray-600 capitalize">
                            {selectedBooking.serviceType.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  {/* Appointment Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Appointment Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <div className="flex items-center gap-2 mb-2 justify-center">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700">Date</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatDate(selectedBooking.requestedDate)}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <div className="flex items-center gap-2 mb-2 justify-center">
                          <Clock className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">Time</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedBooking.requestedStartTime}
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <div className="flex items-center gap-2 mb-2 justify-center">
                          <Clock className="w-5 h-5 text-purple-600" />
                          <span className="text-sm font-medium text-gray-700">Duration</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedBooking.duration} hour{selectedBooking.duration !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  {/* Project Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Project Details</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-gray-600 mt-1" />
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {selectedBooking.projectDetails}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  {/* Pricing */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Pricing</h3>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-6 h-6 text-green-600" />
                          <span className="text-gray-700 font-medium">Total Amount</span>
                        </div>
                        <span className="text-2xl font-bold text-green-700">
                          Rs.{selectedBooking.totalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600 text-center">
                        Rate: Rs.{Math.round(selectedBooking.totalPrice / selectedBooking.duration).toLocaleString()} per hour
                      </div>
                    </div>
                  </div>
                  <Separator />
                  {/* Timestamps */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Timeline</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600">Request Created:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(selectedBooking.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {selectedBooking.updatedAt && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600">Last Updated:</span>
                          <span className="font-medium text-gray-900">
                            {new Date(selectedBooking.updatedAt).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    {/* Mentor actions in modal */}
                    {selectedBooking.status.toLowerCase() === "pending" && (
                      <>
                        <Button
                          onClick={() => setShowUpdateModal(true)}
                          className="bg-orange-500 hover:bg-orange-600 flex-1"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Update Request
                        </Button>
                        <Button
                          onClick={() => {
                            handleStatusUpdate(selectedBooking.id, "accepted", acceptAdjustment)
                            handleCloseModal()
                          }}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 flex-1"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept Request
                        </Button>
                        <Button
                          onClick={() => {
                            setShowRejectConfirm(true)
                          }}
                          disabled={loading}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject Request
                        </Button>
                      </>
                    )}
                    {selectedBooking.status.toLowerCase() === "confirmed" && (
                      <>
                        <Button
                          onClick={() => {
                            handleStatusUpdate(selectedBooking.id, "completed")
                            handleCloseModal()
                          }}
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700 flex-1"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Complete
                        </Button>
                        <Button
                          onClick={() => setShowCancelConfirm(true)}
                          disabled={loading}
                          variant="outline"
                          className="flex-1 border border-gray-400"
                        >
                          <XCircle className="w-4 h-4 mr-2 text-gray-600" />
                          Cancel Request
                        </Button>
                      </>
                    )}
                    {selectedBooking.status.toLowerCase() === "completed" && (
                      <Button className="bg-blue-600 hover:bg-blue-700 flex-1">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </Button>
                    )}
                    <Button variant="outline" onClick={handleCloseModal} className="flex-1">
                      Close
                    </Button>
                  </div>
                </DialogFooter>
                {/* Update Modal */}
                <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Update Appointment Request</DialogTitle>
                      <DialogDescription>Update price, date, time, and description</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        type="number"
                        min="0"
                        placeholder="Price (Rs.)"
                        value={updateFields.price}
                        onChange={e => setUpdateFields(f => ({ ...f, price: e.target.value }))}
                        className="w-full"
                      />
                      <Input
                        type="date"
                        value={updateFields.date}
                        onChange={e => setUpdateFields(f => ({ ...f, date: e.target.value }))}
                        className="w-full"
                      />
                      <Input
                        type="time"
                        value={updateFields.time}
                        onChange={e => setUpdateFields(f => ({ ...f, time: e.target.value }))}
                        className="w-full"
                      />
                      <Input
                        placeholder="Description"
                        value={updateFields.description}
                        onChange={e => setUpdateFields(f => ({ ...f, description: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        handleStatusUpdate(selectedBooking.id, "updated", updateFields)
                        setShowUpdateModal(false)
                        handleCloseModal()
                      }}
                      disabled={loading}
                      className="bg-orange-500 hover:bg-orange-600 w-full mt-2"
                    >
                      Confirm Update
                    </Button>
                    <Button variant="outline" onClick={() => setShowUpdateModal(false)} className="w-full mt-2">Cancel</Button>
                  </DialogContent>
                </Dialog>
                {/* Cancel Confirmation Modal (only for confirmed) */}
                <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Are you sure you want to cancel?</DialogTitle>
                      <DialogDescription>This action cannot be undone. Only confirmed requests can be canceled.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Reason for cancellation"
                        value={cancelReason}
                        onChange={e => setCancelReason(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <DialogFooter className="mt-4">
                      <Button
                        onClick={() => {
                          handleStatusUpdate(selectedBooking.id, "canceled", undefined, cancelReason)
                          setShowCancelConfirm(false)
                          handleCloseModal()
                        }}
                        disabled={loading}
                        className="bg-gray-600 hover:bg-gray-700 w-full"
                      >
                        Confirm Cancel
                      </Button>
                      <Button variant="outline" onClick={() => setShowCancelConfirm(false)} className="w-full mt-2">Back</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {/* Reject Confirmation Modal (only for pending) */}
                <Dialog open={showRejectConfirm} onOpenChange={setShowRejectConfirm}>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Are you sure you want to reject?</DialogTitle>
                      <DialogDescription>Add a note for rejection (optional)</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Note for rejection"
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <DialogFooter className="mt-4">
                      <Button
                        onClick={() => {
                          handleStatusUpdate(selectedBooking.id, "rejected", undefined, rejectReason)
                          setShowRejectConfirm(false)
                          handleCloseModal()
                        }}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 w-full"
                      >
                        Confirm Reject
                      </Button>
                      <Button variant="outline" onClick={() => setShowRejectConfirm(false)} className="w-full mt-2">Back</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
