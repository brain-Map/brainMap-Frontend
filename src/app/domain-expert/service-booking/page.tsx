'use client'
import { useState, useEffect } from "react";
// Removed ServiceBookingStatus enum usage
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useToast } from "@/hooks/use-alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, Eye, CheckCircle, Ban } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext"

interface ServiceBooking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  userId: string;
  username: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userAvatar?: string;
  duration: number;
  projectDetails: string;
  requestedDate: string;
  requestedStartTime: string;
  requestedEndTime: string;
  totalPrice: number;
  status: string;
  sessionType: string;
  acceptedDate?: string;
  acceptedTime?: string;
  acceptedPrice?: number;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  updatedStartTime: string;
  updatedEndTime: string;
  updatedPrice: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-400 text-white";
    case "ACCEPTED":
      return "bg-blue-600 text-white";
    case "REJECTED":
      return "bg-red-500 text-white";
    case "CONFIRMED":
      return "bg-green-500 text-white";
    case "COMPLETED":
      return "bg-gray-700 text-white";
    case "CANCELLED":
      return "bg-gray-400 text-white";
    case "UPDATED":
      return "bg-purple-500 text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
};

import axios from "axios";

const Index = () => {
  //   const { alert } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [updatePrice, setUpdatePrice] = useState("");
  const [updateDate, setUpdateDate] = useState("");
  // Separate start and end times (allows 15-minute stepping)
  const [updateStartTime, setUpdateStartTime] = useState("");
  const [updateEndTime, setUpdateEndTime] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateErrors, setUpdateErrors] = useState<{ date?: string; time?: string; general?: string }>({});
  const [rejectReason, setRejectReason] = useState("");
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const expertId = user?.id;
  const token = localStorage.getItem("accessToken");

  // Fetch bookings helper
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/domain-experts/${expertId}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [expertId, token]);
  console.log("Bookings: ", bookings);

  const handleBookingClick = (booking: ServiceBooking) => {
    setSelectedBooking(booking);
    setDetailDialogOpen(true);
  };

  const handleUpdate = () => {
    if (selectedBooking) {
      // Default update form to current values. Prefer updated* fields when present (for UPDATED status)
      setUpdatePrice((selectedBooking.updatedPrice ?? selectedBooking.totalPrice)?.toString() ?? "");
      // updatedDate may be string or undefined; fall back to requestedDate
      setUpdateDate((selectedBooking.acceptedDate ?? (selectedBooking as any).updatedDate ?? selectedBooking.requestedDate) ?? "");
      // Prefer updated start/end times if they exist (for UPDATED bookings), otherwise requested times
      setUpdateStartTime(selectedBooking.updatedStartTime ?? selectedBooking.requestedStartTime ?? "");
      setUpdateEndTime(selectedBooking.updatedEndTime ?? selectedBooking.requestedEndTime ?? "");
      setUpdateDescription("");
    }
    setDetailDialogOpen(false);
    setUpdateDialogOpen(true);
  };

  const handleUpdateConfirm = async () => {
    if (!selectedBooking) return;
    // Client-side validation
    const validateUpdateForm = () => {
      const errors: any = {};
      // Date: must be today or future
      if (!updateDate) {
        errors.date = "Please select a date.";
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sel = new Date(updateDate);
        sel.setHours(0, 0, 0, 0);
        if (sel < today) {
          errors.date = "Date must be today or in the future.";
        }
      }

      // Times: both required, end > start, 15-minute intervals
      if (!updateStartTime || !updateEndTime) {
        errors.time = "Please select both start and end times.";
      } else {
        const [sh, sm] = updateStartTime.split(":").map((n) => Number(n));
        const [eh, em] = updateEndTime.split(":").map((n) => Number(n));
        const sMinutes = sh * 60 + sm;
        const eMinutes = eh * 60 + em;
        if (sMinutes % 15 !== 0 || eMinutes % 15 !== 0) {
          errors.time = "Times must be on 15-minute intervals (e.g. 09:00, 09:15).";
        } else if (eMinutes <= sMinutes) {
          errors.time = "End time must be after start time.";
        }
      }

      setUpdateErrors(errors);
      return Object.keys(errors).length === 0;
    };

    if (!validateUpdateForm()) {
      return;
    }
    try {
      const body: any = {};
      if (updatePrice) body.updatedPrice = Number(updatePrice);
      if (updateDate) body.updatedDate = updateDate;
      if (updateStartTime) body.updatedStartTime = updateStartTime;
      if (updateEndTime) body.updatedEndTime = updateEndTime;
      if (updateDescription) body.reason = updateDescription;
      console.log(body);
        // Send update to server
        await axios.put(
          `http://localhost:8080/api/v1/service-listings/service-booking/${selectedBooking.id}/update`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await fetchBookings();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update booking");
    } finally {
      setUpdateDialogOpen(false);
      setUpdatePrice("");
      setUpdateDate("");
      setUpdateStartTime("");
      setUpdateEndTime("");
      setUpdateDescription("");
      setUpdateErrors({});
    }
  };

  const closeUpdateDialog = () => {
    // Reset update form state and close dialog
    setUpdateDialogOpen(false);
    setUpdatePrice("");
    setUpdateDate("");
    setUpdateStartTime("");
    setUpdateEndTime("");
    setUpdateDescription("");
    setUpdateErrors({});
  };

  const handleAccept = async (bookingId: string) => {
    console.log("Update clicked: ", bookingId);
    
    try {
      await axios.put(
        `http://localhost:8080/api/v1/service-listings/service-booking/${bookingId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchBookings();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to accept booking");
    } finally {
      setDetailDialogOpen(false);
    }
  };

  const handleReject = () => {
    setDetailDialogOpen(false);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedBooking) return;
    try {
      await axios.put(
        `http://localhost:8080/api/v1/service-listings/service-booking/${selectedBooking.id}/reject`,
        { reason: rejectReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchBookings();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reject booking");
    } finally {
      setRejectDialogOpen(false);
      setRejectReason("");
    }
  };

  const handleComplete = async () => {
    if (!selectedBooking) return;
    try {
      await axios.put(
        `http://localhost:8080/api/v1/service-listings/service-booking/${selectedBooking.id}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchBookings();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to mark booking as complete");
    } finally {
      setDetailDialogOpen(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedBooking) return;
    try {
      await axios.put(
        `http://localhost:8080/api/v1/service-listings/service-booking/${selectedBooking.id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchBookings();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to cancel booking");
    } finally {
      setDetailDialogOpen(false);
    }
  };

  const filteredBookings = activeTab === "all"
    ? bookings
    : bookings.filter(b => b.status === activeTab);

  const getStatusCount = (status: string) => {
    if (status === "all") return bookings.length;
    return bookings.filter(b => b.status === status).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Booking Requests</h1>
          <p className="text-blue-900">Manage your service booking requests</p>
        </div>

        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v as any)}>
          <TabsList className="mb-6">
              <TabsTrigger value="all">
                All ({getStatusCount("all")})
              </TabsTrigger>
              <TabsTrigger value="PENDING">
                Pending ({getStatusCount("PENDING")})
              </TabsTrigger>
              <TabsTrigger value="ACCEPTED">
                Accepted ({getStatusCount("ACCEPTED")})
              </TabsTrigger>
              <TabsTrigger value="CONFIRMED">
                Confirmed ({getStatusCount("CONFIRMED")})
              </TabsTrigger>
              <TabsTrigger value="COMPLETED">
                Completed ({getStatusCount("COMPLETED")})
              </TabsTrigger>
            </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No bookings found</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Session</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                       <TableHead>Quick Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow
                        key={booking.id}
                        className="cursor-pointer transition-colors hover:bg-gray-50 group"
                        onClick={() => handleBookingClick(booking)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={"/image/user_placeholder.jpg"}
                              alt="avatar"
                              className="w-9 h-9 rounded-full border object-cover"
                              style={{ minWidth: "36px" }}
                            />
                            <div>
                              <div className="font-medium">{booking.userFirstName} {booking.userLastName}</div>
                              <div className="text-xs text-muted-foreground">{booking.userEmail}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell
                          className="font-semibold text-foreground underline cursor-pointer hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/services/${booking.serviceId}`;
                          }}
                          title={`Go to service: ${booking.serviceTitle}`}
                        >
                          {booking.serviceTitle}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">
                            {booking.sessionType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>{format(new Date(booking.requestedDate), "MMM dd, yyyy")}</div>
                          <div className="text-xs text-muted-foreground">
                            {booking.requestedStartTime} - {booking.requestedEndTime}
                          </div>
                        </TableCell>
                        <TableCell>{booking.duration} min</TableCell>
                        <TableCell>Rs.{booking.updatedPrice ? booking.updatedPrice.toFixed(2) : booking.totalPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={`flex items-center gap-1 ${getStatusColor(booking.status)} font-medium px-3 py-1 rounded-full`}>
                            {booking.status === "PENDING" && <span className="inline-block w-2 h-2 bg-yellow-300 rounded-full mr-1" />}
                            {booking.status === "ACCEPTED" && <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-1" />}
                            {booking.status === "REJECTED" && <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-1" />}
                            {booking.status === "CONFIRMED" && <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1" />}
                            {booking.status === "COMPLETED" && <span className="inline-block w-2 h-2 bg-gray-600 rounded-full mr-1" />}
                            {booking.status === "CANCELLED" && <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-1" />}
                            {booking.status === "UPDATED" && <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mr-1" />}
                            <span>{booking.status}</span>
                          </Badge>
                        </TableCell>
                         <TableCell>
                           <div className="flex flex-row gap-2 justify-end">
                             <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleBookingClick(booking); }} title="View">
                               <Eye className="w-5 h-5 text-gray-600" />
                             </Button>
                             {booking.status === "PENDING" && (
                               <>
                                 <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleAccept(booking.id); }} title="Accept">
                                   <Check className="w-5 h-5 text-green-600" />
                                 </Button>
                                 <Button
                                   variant="ghost"
                                   size="icon"
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     // ensure the booking is selected so the reject dialog has the id
                                     setSelectedBooking(booking);
                                     handleReject();
                                   }}
                                   title="Reject"
                                 >
                                   <X className="w-5 h-5 text-red-600" />
                                 </Button>
                               </>
                             )}
                             {booking.status === "CONFIRMED" && (
                               <>
                                 <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleComplete(); }} title="Mark as Complete">
                                   <CheckCircle className="w-5 h-5 text-green-600" />
                                 </Button>
                                 <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleCancel(); }} title="Cancel">
                                   <Ban className="w-5 h-5 text-red-600" />
                                 </Button>
                               </>
                             )}
                             {/* Add more status-based actions if needed */}
                           </div>
                         </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail Dialog */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-2xl bg-white rounded-xl shadow-lg p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-1">Booking Details</DialogTitle>
              <DialogDescription className="mb-4">Complete information about this booking request</DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6 border-b pb-4">
                  <div>
                    <Label className="text-muted-foreground">Client Name</Label>
                    <p className="font-medium mt-1">{selectedBooking.userFirstName} {selectedBooking.userLastName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium mt-1">{selectedBooking.userEmail}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Service</Label>
                    <p className="font-medium mt-1">{selectedBooking.serviceTitle}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Session Type</Label>
                    <p className="font-medium mt-1">{selectedBooking.sessionType}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Date</Label>
                    {/* If booking was updated and has updatedStartTime / updatedEndTime or updatedDate, show updated as primary */}
                    {selectedBooking.status === "UPDATED" && (selectedBooking.updatedStartTime || selectedBooking.updatedEndTime || (selectedBooking as any).updatedDate) ? (
                      <div>
                        <p className="font-medium mt-1">{format(new Date((selectedBooking as any).updatedDate ?? selectedBooking.requestedDate), "MMM dd, yyyy")}</p>
                        <div className="text-xs text-muted-foreground">Requested: {format(new Date(selectedBooking.requestedDate), "MMM dd, yyyy")}</div>
                      </div>
                    ) : (
                      <p className="font-medium mt-1">{format(new Date(selectedBooking.requestedDate), "MMM dd, yyyy")}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Time</Label>
                    {selectedBooking.status === "UPDATED" && (selectedBooking.updatedStartTime || selectedBooking.updatedEndTime) ? (
                      <div>
                        <p className="font-medium mt-1">{selectedBooking.updatedStartTime ?? selectedBooking.requestedStartTime} - {selectedBooking.updatedEndTime ?? selectedBooking.requestedEndTime}</p>
                        <div className="text-xs text-muted-foreground">Requested: {selectedBooking.requestedStartTime} - {selectedBooking.requestedEndTime}</div>
                      </div>
                    ) : (
                      <p className="font-medium mt-1">{selectedBooking.requestedStartTime} - {selectedBooking.requestedEndTime}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Duration</Label>
                    <p className="font-medium mt-1">{selectedBooking.duration} minutes</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Price</Label>
                    {selectedBooking.status === "UPDATED" && selectedBooking.updatedPrice ? (
                      <div>
                        <p className="font-medium mt-1">Rs.{Number(selectedBooking.updatedPrice).toFixed(2)}</p>
                        <div className="text-xs text-muted-foreground">Requested: Rs. {selectedBooking.totalPrice.toFixed(2)}</div>
                      </div>
                    ) : (
                      <p className="font-medium mt-1">${selectedBooking.totalPrice.toFixed(2)}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Status</Label>
                    <Badge className={`${getStatusColor(selectedBooking.status)} font-medium mt-1 px-3 py-1 rounded-full`}>
                      {selectedBooking.status}
                    </Badge>
                  </div>
                </div>
                <div className="border-b pb-4">
                  <Label className="text-muted-foreground">Project Details</Label>
                  <p className="mt-2 text-sm text-gray-700 bg-gray-50 rounded p-2">{selectedBooking.projectDetails}</p>
                </div>
                {selectedBooking.rejectionReason && (
                  <div className="border-b pb-4">
                    <Label className="text-muted-foreground">Rejection Reason</Label>
                    <p className="mt-2 text-sm text-red-600 bg-red-50 rounded p-2">{selectedBooking.rejectionReason}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="flex flex-row gap-3 pt-6 justify-end">
              {selectedBooking?.status === "PENDING" && (
                <>
                  <Button variant="outline" onClick={handleUpdate} className="min-w-[110px]">Update</Button>
                  <Button variant="default" onClick={() => handleAccept(selectedBooking.id)} className="min-w-[110px]">Accept</Button>
                  <Button variant="destructive" onClick={handleReject} className="min-w-[110px]">Reject</Button>
                </>
              )}
              {selectedBooking?.status === "CONFIRMED" && (
                <>
                  <Button variant="default" onClick={handleComplete} className="min-w-[150px]">Mark as Complete</Button>
                  <Button variant="destructive" onClick={handleCancel} className="min-w-[110px]">Cancel</Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

      {/* Update Dialog */}
        <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
          <DialogContent className="bg-white rounded-xl shadow-lg p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-1">Update Booking</DialogTitle>
              <DialogDescription className="mb-4">Modify the booking details</DialogDescription>
            </DialogHeader>
            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={updatePrice}
                  onChange={(e) => setUpdatePrice(e.target.value)}
                  className="rounded-md border-gray-300"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={updateDate}
                  onChange={(e) => setUpdateDate(e.target.value)}
                  className="rounded-md border-gray-300"
                />
                {updateErrors.date && <p className="text-sm text-red-600 mt-1">{updateErrors.date}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    step={900}
                    value={updateStartTime}
                    onChange={(e) => setUpdateStartTime(e.target.value)}
                    className="rounded-md border-gray-300"
                    list="time-options"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    step={900}
                    value={updateEndTime}
                    onChange={(e) => setUpdateEndTime(e.target.value)}
                    className="rounded-md border-gray-300"
                    list="time-options"
                  />
                </div>
              </div>
              <datalist id="time-options">
                {/* generate 15-minute intervals from 00:00 to 23:45 */}
                {Array.from({ length: 24 * 4 }).map((_, idx) => {
                  const minutes = idx * 15;
                  const hh = Math.floor(minutes / 60)
                    .toString()
                    .padStart(2, "0");
                  const mm = (minutes % 60).toString().padStart(2, "0");
                  const val = `${hh}:${mm}`;
                  return <option key={val} value={val} />;
                })}
              </datalist>
              {updateErrors.time && <p className="text-sm text-red-600 mt-1">{updateErrors.time}</p>}
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add any notes about the changes..."
                  value={updateDescription}
                  onChange={(e) => setUpdateDescription(e.target.value)}
                  className="rounded-md border-gray-300"
                />
              </div>
            </div>
            <DialogFooter className="flex flex-row gap-3 pt-6 justify-end">
              <Button variant="outline" onClick={closeUpdateDialog} className="min-w-[110px]">Cancel</Button>
              <Button onClick={handleUpdateConfirm} className="min-w-[140px]">Confirm Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent className="bg-white rounded-xl shadow-lg p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-1">Reject Booking</DialogTitle>
              <DialogDescription className="mb-4">Please provide a reason for rejecting this booking</DialogDescription>
            </DialogHeader>
            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="reason">Rejection Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Explain why you're rejecting this booking..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  className="rounded-md border-gray-300"
                />
              </div>
            </div>
            <DialogFooter className="flex flex-row gap-3 pt-6 justify-end">
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)} className="min-w-[110px]">Cancel</Button>
              <Button variant="destructive" onClick={handleRejectConfirm} className="min-w-[170px]">Confirm Rejection</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
};

export default Index;
