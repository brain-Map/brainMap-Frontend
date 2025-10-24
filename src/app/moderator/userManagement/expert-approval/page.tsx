"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Eye, Check, X, Clock, Download, ArrowLeft, AlertTriangle, Users, FileText, Star, TrendingUp } from "lucide-react";
import { expertApprovalApiService, ExpertRequest, ExpertDocument } from '@/services/moderatorApi';
import toast from 'react-hot-toast';

// Using imported types from moderatorApi service

export default function ExpertApprovalPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<ExpertRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState<ExpertRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Rejection modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [isSubmittingRejection, setIsSubmittingRejection] = useState(false);

  // Load expert requests on component mount
  useEffect(() => {
    loadExpertRequests();
  }, []);

  const loadExpertRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await expertApprovalApiService.getExpertRequests();
      
      // Deduplicate requests by ID to prevent React key warnings
      const uniqueRequests = response.requests.reduce((acc, current) => {
        const isDuplicate = acc.find(item => item.id === current.id);
        if (!isDuplicate) {
          acc.push(current);
        } else {
          console.warn(`Duplicate expert request found with ID: ${current.id}`);
        }
        return acc;
      }, [] as typeof response.requests);
      
      setRequests(uniqueRequests);
    } catch (err: any) {
      console.error('Failed to load expert requests:', err);
      setError('Failed to load expert requests. Please try again.');
      toast.error('Failed to load expert requests');
    } finally {
      setLoading(false);
    }
  };

  // Keep selectedTab state clean
  useEffect(() => {
    // No need to reset tabs since we now show all statuses
  }, [selectedTab]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending", icon: Clock },
      APPROVED: { bg: "bg-green-100", text: "text-green-800", label: "Approved", icon: Check },
      REJECTED: { bg: "bg-red-100", text: "text-red-800", label: "Rejected", icon: X }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || Clock;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config?.bg} ${config?.text}`}>
        <Icon className="w-4 h-4" />
        {config?.label}
      </span>
    );
  };

  const handleApproveRequest = async (id: string) => {
    try {
      await expertApprovalApiService.updateExpertStatus({
        expertRequestId: id,
        status: 'APPROVED'
      });
      setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status: 'APPROVED' as const } : req
      ));
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, status: 'APPROVED' });
      }
      toast.success('Expert approved successfully');
    } catch (err: any) {
      console.error('Failed to approve expert:', err);
      const errorMessage = err.response?.data?.message 
        || err.message 
        || 'Failed to approve expert. Please ensure the backend endpoint is implemented.';
      toast.error(errorMessage);
    }
  };

  const handleRejectRequest = async (id: string) => {
    // Open rejection modal instead of immediately rejecting
    setRejectingRequestId(id);
    setShowRejectModal(true);
    setRejectionReason("");
  };

  const submitRejection = async () => {
    if (!rejectingRequestId) return;
    
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setIsSubmittingRejection(true);
    try {
      await expertApprovalApiService.updateExpertStatus({
        expertRequestId: rejectingRequestId,
        status: 'REJECTED',
        reviewNotes: rejectionReason.trim()
      });
      
      setRequests(prev => prev.map(req => 
        req.id === rejectingRequestId ? { ...req, status: 'REJECTED' as const } : req
      ));
      
      if (selectedRequest && selectedRequest.id === rejectingRequestId) {
        setSelectedRequest({ ...selectedRequest, status: 'REJECTED' });
      }
      
      toast.success('Expert rejected successfully');
      setShowRejectModal(false);
      setRejectionReason("");
      setRejectingRequestId(null);
    } catch (err: any) {
      console.error('Failed to reject expert:', err);
      const errorMessage = err.response?.data?.message 
        || err.message 
        || 'Failed to reject expert. Please ensure the backend endpoint is implemented.';
      toast.error(errorMessage);
    } finally {
      setIsSubmittingRejection(false);
    }
  };

  const cancelRejection = () => {
    setShowRejectModal(false);
    setRejectionReason("");
    setRejectingRequestId(null);
  };

  const handleDownloadDocument = async (doc: ExpertDocument) => {
    try {
      // If fileUrl is a full URL, open it directly
      if (doc.fileUrl.startsWith('http://') || doc.fileUrl.startsWith('https://')) {
        window.open(doc.fileUrl, '_blank');
        return;
      }
      
      // Otherwise, construct the full URL with backend base URL
      const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT || '8080';
      const backendUrl = `http://localhost:${backendPort}`;
      const fullUrl = doc.fileUrl.startsWith('/') 
        ? `${backendUrl}${doc.fileUrl}` 
        : `${backendUrl}/${doc.fileUrl}`;
      
      // Open in new tab
      window.open(fullUrl, '_blank');
      toast.success('Opening document...');
    } catch (err: any) {
      console.error('Failed to download document:', err);
      toast.error('Failed to download document');
    }
  };



  const filteredRequests = requests.filter((request) => {
    const searchTermLower = searchTerm.toLowerCase();
    const fullName = `${request.firstName} ${request.lastName}`;
    const matchesSearch = !searchTerm || (
      (fullName?.toLowerCase().includes(searchTermLower)) ||
      (request.email?.toLowerCase().includes(searchTermLower)) ||
      (request.domain?.toLowerCase().includes(searchTermLower))
    );
    
    const matchesTab = selectedTab === "all" || 
                      (selectedTab === "pending" && request.status === "PENDING") ||
                      (selectedTab === "approved" && request.status === "APPROVED") ||
                      (selectedTab === "rejected" && request.status === "REJECTED");
    
    return matchesSearch && matchesTab;
  });

  const getTabCounts = () => {
    return {
      all: requests.length,
      pending: requests.filter(r => r.status === "PENDING").length,
      approved: requests.filter(r => r.status === "APPROVED").length,
      rejected: requests.filter(r => r.status === "REJECTED").length,
    };
  };

  const tabCounts = getTabCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span>Loading expert requests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={loadExpertRequests}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="flex justify-between">
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1 grid gap-1">
                  <h1 className="text-3xl font-bold text-gray-900">Expert Approval</h1>
                  <p className="text-gray-600">Review and approve domain expert applications.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{tabCounts.all}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500 text-white">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{tabCounts.pending}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500 text-white">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{tabCounts.approved}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500 text-white">
                <Check className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Request List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              {/* Search and Filter */}
              <div className="p-4 border-b">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Tabs */}
                <div className="flex space-x-1">
                  {[
                    { id: "all", label: "All", count: tabCounts.all },
                    { id: "pending", label: "Pending", count: tabCounts.pending },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        selectedTab === tab.id
                          ? "bg-blue-100 text-blue-700 border border-blue-300"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Request List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredRequests.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p>No requests found</p>
                    {searchTerm && (
                      <p className="text-sm mt-2">
                        Try adjusting your search terms
                      </p>
                    )}
                  </div>
                ) : (
                  filteredRequests.map((request) => (
                    <div
                      key={request.id}
                      onClick={() => setSelectedRequest(request)}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedRequest?.id === request.id ? "bg-blue-50 border-blue-200" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{`${request.firstName} ${request.lastName}` || 'Unknown'}</h3>
                          <p className="text-sm text-gray-600 mt-1">{request.domain || 'No domain specified'}</p>
                          <p className="text-sm text-gray-500">{request.experience || 'No experience specified'}</p>
                          <div className="mt-2 flex items-center justify-between">
                            {getStatusBadge(request.status)}
                            <span className="text-xs text-gray-500">
                              {request.submittedAt ? new Date(request.submittedAt).toLocaleDateString() : 'Unknown date'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Request Details */}
          <div className="lg:col-span-2">
            {selectedRequest ? (
              <div className="bg-white rounded-lg shadow-sm border">
                {/* Header */}
                <div className="p-6 border-b">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">
                          {selectedRequest.firstName.charAt(0)}{selectedRequest.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{`${selectedRequest.firstName} ${selectedRequest.lastName}`}</h2>
                        <p className="text-gray-600">{selectedRequest.email}</p>
                        <p className="text-gray-500">{selectedRequest.domain || 'Domain not specified'}</p>
                        <div className="mt-2">
                          {getStatusBadge(selectedRequest.status)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {selectedRequest.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApproveRequest(selectedRequest.id)}
                            className="px-4 py-2 text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <Check className="w-4 h-4 inline mr-2" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectRequest(selectedRequest.id)}
                            className="px-4 py-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <X className="w-4 h-4 inline mr-2" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Email</label>
                          <p className="text-gray-900">{selectedRequest.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Domain</label>
                          <p className="text-gray-900">{selectedRequest.domain || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Experience</label>
                          <p className="text-gray-900">{selectedRequest.experience || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Submitted At</label>
                          <p className="text-gray-900">{new Date(selectedRequest.submittedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
                      <div className="space-y-2">
                        {selectedRequest.documents?.length > 0 ? (
                          selectedRequest.documents.map((doc) => (
                            <div key={doc.documentId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                              <div className="flex items-center">
                                <FileText className="w-5 h-5 text-gray-500 mr-3" />
                                <div>
                                  <span className="text-gray-900 font-medium">{doc.fileName}</span>
                                  <p className="text-sm text-gray-500">
                                    {doc.contentType} • {(doc.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                              <button 
                                onClick={() => handleDownloadDocument(doc)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Download document"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No documents uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                {selectedRequest.status === "PENDING" && (
                  <div className="border-t bg-gray-50 px-6 py-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <strong>Status:</strong> Pending Review - This expert application requires your approval
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleRejectRequest(selectedRequest.id)}
                          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center font-medium"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject Application
                        </button>
                        <button
                          onClick={() => handleApproveRequest(selectedRequest.id)}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center font-medium"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve Application
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">Select a Request</h3>
                  <p>Choose a request from the left panel to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Reject Expert Request</h3>
                </div>
                <button
                  onClick={cancelRejection}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmittingRejection}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting this expert request. This will help the applicant understand why their application was not approved.
              </p>
              
              <div className="space-y-2">
                <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="rejectionReason"
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  placeholder="e.g., Insufficient documentation provided, qualifications do not meet requirements, etc."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  disabled={isSubmittingRejection}
                  maxLength={500}
                />
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Be specific and professional</span>
                  <span>{rejectionReason.length}/500</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex justify-end space-x-3">
              <button
                onClick={cancelRejection}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isSubmittingRejection}
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                disabled={!rejectionReason.trim() || isSubmittingRejection}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmittingRejection ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Rejecting...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Reject Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}