"use client"
import { Calendar, Package, CheckCircle, XCircle, ChevronRight, Clock, DollarSign, MessageSquare } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from "@/contexts/AuthContext"

type Booking = {
  id: string
  userId?: string
  serviceTitle: string
  userFirstName: string
  userLastName?: string
  username?: string
  bookingMode: 'HOURLY' | 'MONTHLY' | 'PROJECT_BASED'
  status: 'PENDING' | 'UPDATED' | 'CONFIRMED' | 'REJECTED'
  totalPrice: number
  requestedDate?: string | null // YYYY-MM-DD
  requestedStartTime?: string | null // HH:MM:SS
  requestedEndTime?: string | null // HH:MM:SS
  requestedMonths?: string[]
  projectDeadline?: string | null
  projectDetails?: string | null
  // proposed / updated values (optional)
  updatedDate?: string | null
  updatedStartTime?: string | null
  updatedEndTime?: string | null
  updatedMonths?: string[] | null
  updatedDeadline?: string | null
  updatedPrice?: number | null
  // if a request was rejected, API may return a reason
  rejectionReason?: string | null
}


const tabs = ['Pending', 'Updated', 'Confirmed', 'Rejected', 'All']

export default function RequestsPage() {
  const searchParams = useSearchParams()
  const { user } = useAuth();
  const mentorId = user?.id

  const [currentTab, setCurrentTab] = useState<string>('Pending')
  const [requests, setRequests] = useState<Booking[]>([])
  const [selected, setSelected] = useState<Booking | null>(null)
  const [showUpdate, setShowUpdate] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [token, setToken] = useState<string>('')

  // UI controls
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest'|'oldest'>('newest')

  // update form state
  const [updatedDate, setUpdatedDate] = useState('')
  const [updatedStartTime, setUpdatedStartTime] = useState('')
  const [updatedEndTime, setUpdatedEndTime] = useState('')
  const [updatedMonths, setUpdatedMonths] = useState('')
  const [updatedDeadline, setUpdatedDeadline] = useState('')
  const [updatedPrice, setUpdatedPrice] = useState('')
  const [rejectReason, setRejectReason] = useState('')

  // initialize token from localStorage
  useEffect(() => {
    const t = localStorage.getItem('accessToken') || ''
    setToken(t)
  }, [])

  const filtered = requests.filter(r => currentTab === 'All' ||
    (currentTab === 'Pending' && r.status === 'PENDING') ||
    (currentTab === 'Updated' && r.status === 'UPDATED') ||
    (currentTab === 'Confirmed' && r.status === 'CONFIRMED') ||
    (currentTab === 'Rejected' && r.status === 'REJECTED')
  )

  // apply search and sort
  const searched = filtered.filter(r => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return true
    return (r.userFirstName || '').toLowerCase().includes(q) || (r.username || '').toLowerCase().includes(q) || (r.serviceTitle || '').toLowerCase().includes(q)
  })
  const sorted = searched.slice().sort((a,b)=> {
    if (sortOrder === 'newest') return b.id.localeCompare(a.id)
    return a.id.localeCompare(b.id)
  })

  const openDetail = (r: Booking) => {
    setSelected(r)
    // prefill update form state
    // prefer any already-proposed values when pre-filling
    setUpdatedDate((r.updatedDate ?? r.requestedDate) ?? '')
    setUpdatedStartTime((r.updatedStartTime ?? r.requestedStartTime) ? (r.updatedStartTime ?? r.requestedStartTime)!.slice(0,5) : '')
    setUpdatedEndTime((r.updatedEndTime ?? r.requestedEndTime) ? (r.updatedEndTime ?? r.requestedEndTime)!.slice(0,5) : '')
    setUpdatedMonths(((r.updatedMonths ?? r.requestedMonths) || []).join(','))
    setUpdatedDeadline((r.updatedDeadline ?? r.projectDeadline) ?? '')
    setUpdatedPrice((r.updatedPrice ?? r.totalPrice) ? String(r.updatedPrice ?? r.totalPrice) : '')
  }
  const closeDetail = () => { setSelected(null); setShowUpdate(false); setShowReject(false) }

  const router = useRouter()

  const handleMessage = (r: Booking | null) => {
    if (!r) return
    // attempt to use explicit userId if available, fall back to username (may be email)
    const targetId = (r as any).userId || (r.username || '')
    if (!targetId) {
      alert('Cannot open chat: user id not available for this request.')
      return
    }
    // set a flag so the chat page can auto-open the conversation
    try {
      localStorage.setItem('openChatWith', JSON.stringify({ id: targetId, name: r.userFirstName || r.username || 'User' }))
    } catch (e) {
      // ignore
    }
    router.push('/chat')
  }

  const handleQuickAccept = (r: Booking) => {
    // call accept endpoint
    acceptBooking(r.id, r)
  }

  const handleQuickReject = (r: Booking) => {
    setSelected(r)
    setShowReject(true)
  }

  const handlePropose = async () => {
    // validate
    if (!selected) return
    const payload: any = {}
    if (selected.bookingMode === 'HOURLY') {
      if (!updatedDate || !updatedStartTime || !updatedEndTime) { alert('Please provide date and start/end times'); return }
      // ensure end > start
      const [sh, sm] = updatedStartTime.split(':').map(Number)
      const [eh, em] = updatedEndTime.split(':').map(Number)
      if ((eh*60+em) <= (sh*60+sm)) { alert('End time must be after start time'); return }
      payload.updatedDate = updatedDate
      payload.updatedStartTime = updatedStartTime + ':00'
      payload.updatedEndTime = updatedEndTime + ':00'
    }
    if (selected.bookingMode === 'MONTHLY') {
      if (!updatedMonths.trim()) { alert('Please provide months'); return }
      payload.updatedMonths = updatedMonths.split(',').map(s=>s.trim())
    }
    if (selected.bookingMode === 'PROJECT_BASED') {
      if (!updatedDeadline) { alert('Please provide a deadline'); return }
      payload.updatedDeadline = updatedDeadline
    }
    if (updatedPrice) payload.updatedPrice = Number(updatedPrice)
    await updateBooking(selected.id, payload)
    setCurrentTab('Updated')
  }

  // Map API response item to our Booking type (defensive)
  const mapApiToBooking = (item: any): Booking => {
    return {
      id: item.id,
      serviceTitle: item.serviceTitle || item.serviceName || item.serviceId,
      userFirstName: item.userFirstName || item.username || item.userName || 'User',
      username: item.username || item.userEmail || '',
      bookingMode: (item.bookingMode || item.booking_type || 'HOURLY') as Booking['bookingMode'],
      status: (item.status || 'PENDING') as Booking['status'],
      totalPrice: Number(item.totalPrice ?? item.selectedPricingPrice ?? 0),
      requestedDate: item.requestedDate ?? item.requested_date ?? null,
      requestedStartTime: item.requestedStartTime ?? item.requested_start_time ?? null,
      requestedEndTime: item.requestedEndTime ?? item.requested_end_time ?? null,
      requestedMonths: item.requestedMonths ?? item.requested_months ?? undefined,
      projectDeadline: item.projectDeadline ?? item.project_deadline ?? null,
      projectDetails: item.projectDetails ?? item.projectDetails ?? item.description ?? null,
      // proposed/updated values might come from API as updated* fields or proposed* fields
      updatedDate: item.updatedDate ?? item.proposedDate ?? item.proposed_date ?? null,
      updatedStartTime: item.updatedStartTime ?? item.proposedStartTime ?? item.proposed_start_time ?? null,
      updatedEndTime: item.updatedEndTime ?? item.proposedEndTime ?? item.proposed_end_time ?? null,
      updatedMonths: item.updatedMonths ?? item.proposedMonths ?? item.proposed_months ?? undefined,
      updatedDeadline: item.updatedDeadline ?? item.proposedDeadline ?? item.proposed_deadline ?? null,
      updatedPrice: item.updatedPrice ?? item.proposedPrice ?? item.proposed_price ?? null,
      rejectionReason: item.rejectionReason ?? item.rejectedReason ?? item.rejection_reason ?? null,
    }
  }

  const fetchBookings = async (mentorId: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/service-listings/mentor/${mentorId}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
      const data = await res.json()
      // API returns array
      const mapped = Array.isArray(data) ? data.map(mapApiToBooking) : []
      setRequests(mapped)
    } catch (err: any) {
      console.error(err)
      setError(err?.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // wait for mentorId and token
    if (!mentorId || !token) return
    fetchBookings(mentorId)
  }, [mentorId, token])

  // close detail on ESC
  useEffect(()=>{
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDetail() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  // API actions
  const acceptBooking = async (bookingId: string, booking?: Booking) => {
    setIsSubmitting(true)
    try {
      const body: any = {}
      // try to send minimal useful accepted data if available
      if (booking) {
        if (booking.bookingMode === 'HOURLY') {
          body.acceptedDate = booking.requestedDate
          body.acceptedStartTime = booking.requestedStartTime
          body.acceptedEndTime = booking.requestedEndTime
        }
        if (booking.bookingMode === 'MONTHLY') {
          body.acceptedMonths = booking.requestedMonths
        }
        if (booking.bookingMode === 'PROJECT_BASED') {
          body.acceptedDate = booking.projectDeadline
        }
        body.acceptedPrice = booking?.totalPrice ?? 0
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/service-listings/service-booking/${bookingId}/accept`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        credentials: 'include',
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error(`Accept failed: ${res.status}`)
      alert('Booking accepted')
      if (mentorId) fetchBookings(mentorId)
    } catch (err: any) {
      console.error(err)
      alert(err?.message || 'Failed to accept')
    } finally { setIsSubmitting(false) }
  }

  const rejectBooking = async (bookingId: string, reason: string) => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/service-listings/service-booking/${bookingId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        credentials: 'include',
        body: JSON.stringify({ reason })
      })
      if (!res.ok) throw new Error(`Reject failed: ${res.status}`)
      alert('Booking rejected')
      setShowReject(false)
      setRejectReason('')
      if (mentorId) fetchBookings(mentorId)
    } catch (err: any) {
      console.error(err)
      alert(err?.message || 'Failed to reject')
    } finally { setIsSubmitting(false) }
  }

  const updateBooking = async (bookingId: string, payload: any) => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/service-listings/service-booking/${bookingId}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(`Update failed: ${res.status}`)
      alert('Booking update proposed')
      setShowUpdate(false)
      if (mentorId) fetchBookings(mentorId)
    } catch (err: any) {
      console.error(err)
      alert(err?.message || 'Failed to update')
    } finally { setIsSubmitting(false) }
  }

  const formatTime = (t?: string | null) => t ? t.slice(0,5) : '--:--'

  return (
    <div className="flex-1 overflow-auto bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Booking Requests</h1>
          <p className="mt-2 text-gray-600">Overview of incoming mentorship requests. Click any request to view details and respond.</p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="border rounded-md overflow-hidden bg-white">
              <nav className="flex -space-x-px" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCurrentTab(tab)}
                    className={`px-4 py-2 text-sm font-medium ${currentTab === tab ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'text-gray-600 hover:bg-gray-50'}`}
                    aria-pressed={currentTab === tab}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="px-3 py-2 rounded-md border w-56" placeholder="Search user, service or email" aria-label="Search requests" />
            <select value={sortOrder} onChange={(e)=>setSortOrder(e.target.value as any)} className="px-3 py-2 rounded-md border bg-white">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="bg-white p-12 rounded-lg flex items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                <span className="ml-3 text-sm text-gray-600">Loading requests…</span>
              </div>
            ) : sorted.length === 0 ? (
              <div className="bg-white p-8 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-gray-800">No requests</h3>
                <p className="text-sm text-gray-500 mt-2">No results match your filters. Try clearing search or selecting a different tab.</p>
              </div>
            ) : (
              sorted.map((r) => (
                <div key={r.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {r.userFirstName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{r.userFirstName} — {r.serviceTitle}</h3>
                          <p className="text-sm text-gray-600">{r.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-gray-700">
                          <span>Rs.{r.totalPrice.toLocaleString()}</span>
                          {r.updatedPrice != null && r.updatedPrice !== r.totalPrice && (
                            <span className="ml-2 text-xs text-blue-700">Proposed: Rs.{String(r.updatedPrice).toLocaleString()}</span>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${r.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : r.status === 'UPDATED' ? 'bg-blue-100 text-blue-800' : r.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {r.status}
                        </span>
                        <button onClick={() => handleMessage(r)} className="p-2 rounded hover:bg-gray-100" aria-label={`Message ${r.userFirstName}`}>
                          <MessageSquare className="w-4 h-4 text-gray-500" />
                        </button>
                        <button onClick={() => openDetail(r)} className="p-2 rounded hover:bg-gray-100" aria-label={`Open details for ${r.userFirstName}`}>
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-700 gap-3">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">Mode:</span>
                          <span className="text-sm text-gray-600">{r.bookingMode}</span>
                        </div>
                        {r.bookingMode === 'HOURLY' && (
                          <div className="flex flex-col text-sm text-gray-700 gap-1">
                            <div className="flex items-center gap-3">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{r.requestedDate ?? '—'} • {formatTime(r.requestedStartTime)} - {formatTime(r.requestedEndTime)}</span>
                            </div>
                            {r.updatedDate || r.updatedStartTime || r.updatedEndTime ? (
                              <div className="flex items-center gap-3 text-xs text-blue-700">
                                <Calendar className="h-4 w-4 text-blue-300" />
                                <span>Proposed: {r.updatedDate ?? r.requestedDate} • {formatTime(r.updatedStartTime) ?? formatTime(r.requestedStartTime)} - {formatTime(r.updatedEndTime) ?? formatTime(r.requestedEndTime)}</span>
                              </div>
                            ) : null}
                          </div>
                        )}
                        {r.bookingMode === 'MONTHLY' && (
                          <div className="flex flex-col text-sm text-gray-700 gap-1">
                            <div className="flex items-center gap-3">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{r.requestedMonths?.join(', ')}</span>
                            </div>
                            {r.updatedMonths && r.updatedMonths.length > 0 && (
                              <div className="flex items-center gap-3 text-xs text-blue-700">
                                <Calendar className="h-4 w-4 text-blue-300" />
                                <span>Proposed: {r.updatedMonths.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        )}
                        {r.bookingMode === 'PROJECT_BASED' && (
                          <div className="flex flex-col text-sm text-gray-700 gap-1">
                            <div className="flex items-center gap-3">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>Deadline: {r.projectDeadline}</span>
                            </div>
                            {r.updatedDeadline && (
                              <div className="flex items-center gap-3 text-xs text-blue-700">
                                <Clock className="h-4 w-4 text-blue-300" />
                                <span>Proposed: {r.updatedDeadline}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setSelected(r); setShowReject(true) }} disabled={isSubmitting} className="px-3 py-1 border rounded text-sm text-red-600 hover:bg-red-50 disabled:opacity-50">Reject</button>
                        <button onClick={() => { if (confirm('Accept this booking?')) handleQuickAccept(r) }} disabled={isSubmitting} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">Accept</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right column: quick stats */}
          <aside className="space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Overview</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between"><span>Pending</span><span>{requests.filter(r=>r.status==='PENDING').length}</span></div>
                <div className="flex justify-between"><span>Updated</span><span>{requests.filter(r=>r.status==='UPDATED').length}</span></div>
                <div className="flex justify-between"><span>Confirmed</span><span>{requests.filter(r=>r.status==='CONFIRMED').length}</span></div>
                <div className="flex justify-between"><span>Rejected</span><span>{requests.filter(r=>r.status==='REJECTED').length}</span></div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Tips</h4>
              <p className="text-xs text-gray-600">Use Accept to confirm the request. Use Update to propose new times or prices. Reject requires a reason.</p>
            </div>
          </aside>
        </div>
      </div>

      {/* Slide-over detail panel */}
      {selected && (
        <div className="fixed inset-0 z-40 flex mt-15">
          <div className="flex-1" onClick={closeDetail} />
          <div className="w-full max-w-2xl bg-white shadow-xl overflow-auto">
            <div className="p-6 border-b flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">Request from {selected.userFirstName}</h2>
                <p className="text-sm text-gray-600">{selected.serviceTitle} • {selected.bookingMode}</p>
              </div>
              <button onClick={closeDetail} className="text-gray-500">Close</button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded border">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">User</h3>
                  <p className="text-sm text-gray-800">{selected.userFirstName} ({selected.username})</p>
                </div>
                <div className="bg-gray-50 p-4 rounded border">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Price</h3>
                  <p className="text-sm text-gray-800">
                    <span>Rs.{selected.totalPrice.toLocaleString()}</span>
                    {selected.updatedPrice != null && selected.updatedPrice !== selected.totalPrice && (
                      <span className="ml-2 text-xs text-blue-700">Proposed: Rs.{String(selected.updatedPrice).toLocaleString()}</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded border">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Details</h3>
                {selected.bookingMode === 'HOURLY' && (
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-4">
                      <div className="w-1/2"><strong>Original:</strong> <div className="text-sm text-gray-700">{selected.requestedDate} • {selected.requestedStartTime?.slice(0,5)} - {selected.requestedEndTime?.slice(0,5)}</div></div>
                      <div className="w-1/2"><strong>Proposed:</strong> <div className="text-sm text-blue-700">{selected.updatedDate ?? selected.requestedDate} • {selected.updatedStartTime?.slice(0,5) ?? selected.requestedStartTime?.slice(0,5)} - {selected.updatedEndTime?.slice(0,5) ?? selected.requestedEndTime?.slice(0,5)}</div></div>
                    </div>
                    <div><strong>Notes:</strong> {selected.projectDetails}</div>
                  </div>
                )}
                {selected.bookingMode === 'MONTHLY' && (
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-4">
                      <div className="w-1/2"><strong>Original:</strong> <div className="text-sm text-gray-700">{selected.requestedMonths?.join(', ')}</div></div>
                      <div className="w-1/2"><strong>Proposed:</strong> <div className="text-sm text-blue-700">{selected.updatedMonths?.join(', ') ?? selected.requestedMonths?.join(', ')}</div></div>
                    </div>
                    <div><strong>Notes:</strong> {selected.projectDetails}</div>
                  </div>
                )}
                {selected.bookingMode === 'PROJECT_BASED' && (
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-4">
                      <div className="w-1/2"><strong>Original:</strong> <div className="text-sm text-gray-700">{selected.projectDeadline}</div></div>
                      <div className="w-1/2"><strong>Proposed:</strong> <div className="text-sm text-blue-700">{selected.updatedDeadline ?? selected.projectDeadline}</div></div>
                    </div>
                    <div><strong>Description:</strong> <div className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{selected.projectDetails}</div></div>
                  </div>
                )}

                {/* Show rejection reason if present */}
                {selected.rejectionReason && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded">
                    <h4 className="text-sm font-semibold text-red-700">Rejection reason</h4>
                    <p className="text-sm text-red-600 mt-1 whitespace-pre-wrap">{selected.rejectionReason}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => { handleQuickAccept(selected); closeDetail() }} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md">
                  <CheckCircle className="w-4 h-4" /> Accept
                </button>
                <button onClick={() => handleMessage(selected)} className="px-4 py-2 border rounded-md flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Message
                </button>
                <button onClick={() => setShowUpdate(true)} className="px-4 py-2 border rounded-md">Update</button>
                <button onClick={() => setShowReject(true)} className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-md"> <XCircle className="w-4 h-4"/> Reject</button>
              </div>

              {/* Update modal (inline) */}
              {showUpdate && selected && (
                <div className="bg-gray-50 p-4 rounded border mt-4">
                  <h4 className="text-sm font-semibold mb-2">Propose an update</h4>
                  {selected.bookingMode === 'HOURLY' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input type="date" value={updatedDate} onChange={(e) => setUpdatedDate(e.target.value)} className="p-2 border rounded" />
                      <input type="time" value={updatedStartTime} onChange={(e) => setUpdatedStartTime(e.target.value)} className="p-2 border rounded" step={1800} />
                      <input type="time" value={updatedEndTime} onChange={(e) => setUpdatedEndTime(e.target.value)} className="p-2 border rounded" step={1800} />
                    </div>
                  )}
                  {selected.bookingMode === 'MONTHLY' && (
                    <div>
                      <label className="text-sm">Months (comma-separated YYYY-MM)</label>
                      <input value={updatedMonths} onChange={(e) => setUpdatedMonths(e.target.value)} className="w-full p-2 border rounded mt-1" />
                    </div>
                  )}
                  {selected.bookingMode === 'PROJECT_BASED' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input type="date" value={updatedDeadline} onChange={(e) => setUpdatedDeadline(e.target.value)} className="p-2 border rounded" />
                      <input value={updatedPrice} onChange={(e) => setUpdatedPrice(e.target.value)} className="p-2 border rounded" />
                    </div>
                  )}
                  {/* Price editable for all modes */}
                  {selected.bookingMode !== 'PROJECT_BASED' && (
                    <div className="mt-3">
                      <label className="text-sm">Price (Rs.)</label>
                      <input value={updatedPrice} onChange={(e) => setUpdatedPrice(e.target.value)} className="w-full p-2 border rounded mt-1" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={handlePropose} className="px-3 py-2 bg-blue-600 text-white rounded">Propose</button>
                    <button onClick={() => setShowUpdate(false)} className="px-3 py-2 border rounded">Cancel</button>
                  </div>
                </div>
              )}

              {/* Reject modal (inline) */}
              {showReject && selected && (
                <div className="bg-gray-50 p-4 rounded border mt-4">
                  <h4 className="text-sm font-semibold mb-2">Reject request</h4>
                  <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reason for rejection" className="w-full p-2 border rounded h-24" />
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={async () => {
                      if (!rejectReason.trim()) { alert('Please provide a reason'); return }
                      await rejectBooking(selected.id, rejectReason.trim())
                      setCurrentTab('Rejected')
                    }} className="px-3 py-2 bg-red-600 text-white rounded">Confirm Reject</button>
                    <button onClick={() => setShowReject(false)} className="px-3 py-2 border rounded">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
