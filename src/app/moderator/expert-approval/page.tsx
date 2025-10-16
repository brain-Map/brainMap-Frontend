"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Eye, Check, X, Clock, Download, ArrowLeft, AlertTriangle, Users, FileText, Star, TrendingUp } from "lucide-react";
import { expertApprovalApiService } from '@/services/moderatorApi';
import toast from 'react-hot-toast';

// TypeScript interfaces and types
interface Document {
  name: string;
  type: string;
  verified: boolean;
}

interface Project {
  title: string;
  duration: string;
  role: string;
  description: string;
  technologies: string[];
  outcome: string;
}

interface ExpertRequest {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  profileImage?: string;
  domain: string;
  specialization: string;
  education: string;
  experience: string;
  currentPosition: string;
  institution: string;
  submittedDate: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  publications?: number;
  citations?: number;
  documents: Document[];
  bio?: string;
  researchAreas: string[];
  achievements: string[];
  projects: Project[];
  reviewedBy?: number;
  reviewedDate?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ExpertApprovalPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<ExpertRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState<ExpertRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load expert requests on component mount
  useEffect(() => {
    loadExpertRequests();
  }, []);

  const loadExpertRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await expertApprovalApiService.getExpertRequests();
      setRequests(response.requests);
    } catch (err: any) {
      console.error('Failed to load expert requests:', err);
      setError('Failed to load expert requests. Please try again.');
      toast.error('Failed to load expert requests');
    } finally {
      setLoading(false);
    }
  };

  // Reset filter to "all" if it's set to "approved" or "rejected" since we don't show those requests
  useEffect(() => {
    if (selectedTab === "approved" || selectedTab === "rejected") {
      setSelectedTab("all");
    }
  }, [selectedTab]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending", icon: Clock },
      under_review: { bg: "bg-blue-100", text: "text-blue-800", label: "Under Review", icon: Eye },
      approved: { bg: "bg-green-100", text: "text-green-800", label: "Approved", icon: Check },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected", icon: X }
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

  const handleApproveRequest = async (id: number) => {
    try {
      await expertApprovalApiService.updateExpertStatus({
        expertRequestId: id,
        status: 'approved'
      });
      setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status: 'approved' as const } : req
      ));
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, status: 'approved' });
      }
      toast.success('Expert approved successfully');
    } catch (err: any) {
      console.error('Failed to approve expert:', err);
      toast.error('Failed to approve expert');
    }
  };

  const handleRejectRequest = async (id: number) => {
    try {
      await expertApprovalApiService.updateExpertStatus({
        expertRequestId: id,
        status: 'rejected'
      });
      setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status: 'rejected' as const } : req
      ));
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, status: 'rejected' });
      }
      toast.success('Expert rejected successfully');
    } catch (err: any) {
      console.error('Failed to reject expert:', err);
      toast.error('Failed to reject expert');
    }
  };

  const handleReviewRequest = async (id: number) => {
    try {
      await expertApprovalApiService.updateExpertStatus({
        expertRequestId: id,
        status: 'under_review'
      });
      setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status: 'under_review' as const } : req
      ));
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, status: 'under_review' });
      }
      toast.success('Expert moved to review');
    } catch (err: any) {
      console.error('Failed to update expert status:', err);
      toast.error('Failed to update expert status');
    }
  };

  const filteredRequests = requests.filter((request) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || (
      (request.name?.toLowerCase().includes(searchTermLower)) ||
      (request.email?.toLowerCase().includes(searchTermLower)) ||
      (request.domain?.toLowerCase().includes(searchTermLower)) ||
      (request.specialization?.toLowerCase().includes(searchTermLower))
    );
    
    const matchesTab = selectedTab === "all" || 
                      (selectedTab === "pending" && request.status === "pending") ||
                      (selectedTab === "under_review" && request.status === "under_review") ||
                      (selectedTab === "approved" && request.status === "approved") ||
                      (selectedTab === "rejected" && request.status === "rejected");
    
    return matchesSearch && matchesTab;
  });

  const getTabCounts = () => {
    return {
      all: requests.length,
      pending: requests.filter(r => r.status === "pending").length,
      under_review: requests.filter(r => r.status === "under_review").length,
      approved: requests.filter(r => r.status === "approved").length,
      rejected: requests.filter(r => r.status === "rejected").length,
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expert Approval</h1>
              <p className="text-gray-600 mt-1">Review and approve domain expert applications</p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex space-x-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Total Requests</p>
                    <p className="text-2xl font-semibold text-gray-900">{tabCounts.all}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-semibold text-gray-900">{tabCounts.pending}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center">
                  <Eye className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Under Review</p>
                    <p className="text-2xl font-semibold text-gray-900">{tabCounts.under_review}</p>
                  </div>
                </div>
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
                    { id: "under_review", label: "Review", count: tabCounts.under_review },
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
                          <h3 className="font-medium text-gray-900">{request.name || 'Unknown'}</h3>
                          <p className="text-sm text-gray-600 mt-1">{request.domain || 'No domain specified'}</p>
                          <p className="text-sm text-gray-500">{request.specialization || 'No specialization specified'}</p>
                          <div className="mt-2 flex items-center justify-between">
                            {getStatusBadge(request.status)}
                            <span className="text-xs text-gray-500">
                              {request.submittedDate ? new Date(request.submittedDate).toLocaleDateString() : 'Unknown date'}
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
                      <img
                        src={selectedRequest.profileImage || "/public/image/user_placeholder.jpg"}
                        alt={selectedRequest.name}
                        className="w-16 h-16 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/public/image/user_placeholder.jpg";
                        }}
                      />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedRequest.name}</h2>
                        <p className="text-gray-600">{selectedRequest.currentPosition}</p>
                        <p className="text-gray-500">{selectedRequest.institution}</p>
                        <div className="mt-2">
                          {getStatusBadge(selectedRequest.status)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {selectedRequest.status === "pending" && (
                        <button
                          onClick={() => handleReviewRequest(selectedRequest.id)}
                          className="px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Eye className="w-4 h-4 inline mr-2" />
                          Review
                        </button>
                      )}
                      
                      {(selectedRequest.status === "pending" || selectedRequest.status === "under_review") && (
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

                {/* Content Tabs */}
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
                          <label className="text-sm font-medium text-gray-700">Phone</label>
                          <p className="text-gray-900">{selectedRequest.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Location</label>
                          <p className="text-gray-900">{selectedRequest.location || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Experience</label>
                          <p className="text-gray-900">{selectedRequest.experience}</p>
                        </div>
                      </div>
                    </div>

                    {/* Academic Background */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Background</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Education</label>
                          <p className="text-gray-900">{selectedRequest.education}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Domain & Specialization</label>
                          <p className="text-gray-900">{selectedRequest.domain} - {selectedRequest.specialization}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Biography</label>
                          <p className="text-gray-900">{selectedRequest.bio || 'No biography provided'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Research Profile */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Research Profile</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-blue-600">{selectedRequest.publications || 0}</p>
                          <p className="text-sm text-blue-600">Publications</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-green-600">{selectedRequest.citations || 0}</p>
                          <p className="text-sm text-green-600">Citations</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-purple-600">{selectedRequest.projects?.length || 0}</p>
                          <p className="text-sm text-purple-600">Projects</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Research Areas</label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedRequest.researchAreas?.map((area, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                {area}
                              </span>
                            )) || <span className="text-gray-500">No research areas specified</span>}
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">Achievements</label>
                          {selectedRequest.achievements?.length > 0 ? (
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              {selectedRequest.achievements.map((achievement, index) => (
                                <li key={index} className="text-gray-900">{achievement}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500 mt-2">No achievements specified</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                      <div className="space-y-2">
                        {selectedRequest.documents?.length > 0 ? (
                          selectedRequest.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                              <div className="flex items-center">
                                <FileText className="w-5 h-5 text-gray-500 mr-3" />
                                <span className="text-gray-900">{doc.name}</span>
                                {doc.verified && (
                                  <Check className="w-4 h-4 text-green-600 ml-2" />
                                )}
                              </div>
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No documents uploaded</p>
                        )}
                      </div>
                    </div>

                    {/* Projects */}
                    {selectedRequest.projects && selectedRequest.projects.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
                        <div className="space-y-4">
                          {selectedRequest.projects.map((project, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">{project.title}</h4>
                                <span className="text-sm text-gray-500">{project.duration}</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{project.role}</p>
                              <p className="text-gray-700 mb-3">{project.description}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-2">
                                {project.technologies?.map((tech, techIndex) => (
                                  <span key={techIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                    {tech}
                                  </span>
                                )) || <span className="text-gray-500 text-xs">No technologies specified</span>}
                              </div>
                              
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Outcome: </span>
                                <span className="text-gray-900">{project.outcome}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
    </div>
  );
}