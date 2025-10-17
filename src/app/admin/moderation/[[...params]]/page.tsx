"use client";

import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import {
  Eye,
  MessageSquare,
  Filter,
  Search,
  ArrowUpDown,
  X,
  Check,
  AlertTriangle,
  FileText,
  MessageCircle,
  Star,
  Book,
} from "lucide-react";
import { useParams } from "next/navigation";

// Types
interface InquiryItem {
  id: string;
  reportedUser: string;
  reportedUserAvatar: string;
  contentType: "project" | "comment" | "post" | "review";
  contentTitle: string;
  reason: string;
  status: "pending" | "reviewed" | "resolved";
  reportedBy: string;
  reportDate: string;
  description: string;
}

interface ResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: InquiryItem | null;
  onSubmit: (response: string, status: string) => void;
}

// Response Modal Component
const ResponseModal: React.FC<ResponseModalProps> = ({
  isOpen,
  onClose,
  inquiry,
  onSubmit,
}) => {
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("reviewed");

  if (!isOpen || !inquiry) return null;

  const handleSubmit = () => {
    onSubmit(response, status);
    setResponse("");
    setStatus("reviewed");
    onClose();
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "project":
        return <Book className="w-4 h-4" />;
      case "comment":
        return <MessageCircle className="w-4 h-4" />;
      case "post":
        return <FileText className="w-4 h-4" />;
      case "review":
        return <Star className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Respond to Inquiry
                </h2>
                <p className="text-sm text-gray-600">Inquiry ID: {inquiry.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Inquiry Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Inquiry Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Reported User:</span>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {inquiry.reportedUserAvatar}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {inquiry.reportedUser}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-gray-600">Inquiry Type:</span>
                <div className="flex items-center space-x-2 mt-1">
                  {getContentTypeIcon(inquiry.contentType)}
                  <span className="font-medium text-gray-900 capitalize">
                    {inquiry.contentType}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-gray-600">Content Title:</span>
                <p className="font-medium text-gray-900 mt-1">
                  {inquiry.contentTitle}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Reported By:</span>
                <p className="font-medium text-gray-900 mt-1">
                  {inquiry.reportedBy}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Reason:</span>
                <p className="font-medium text-gray-900 mt-1">
                  {inquiry.reason}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Description:</span>
                <p className="text-gray-700 mt-1">{inquiry.description}</p>
              </div>
            </div>
          </div>

          {/* Response Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Response
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Enter your response to this report..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Response
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function InquiryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [sortField, setSortField] = useState("reportDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // 1-based
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const params = useParams();

  // Overview stats from backend
  type InquiryOverview = {
    totalInquiries: number;
    pending: number;
    resolved: number;
    reviewed: number;
  };
  const [overview, setOverview] = useState<InquiryOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState<boolean>(false);
  const [overviewError, setOverviewError] = useState<string | null>(null);

  // Sample data
  const [inquiries, setInquiries] = useState<InquiryItem[]>([
    {
      id: "RPT-001",
      reportedUser: "John Smith",
      reportedUserAvatar: "JS",
      contentType: "post",
      contentTitle: "Machine Learning Fundamentals Discussion",
      reason: "Inappropriate Content",
      status: "pending",
      reportedBy: "Sarah Wilson",
      reportDate: "2024-01-15 14:30",
      description:
        "User posted inappropriate comments that violate community guidelines regarding respectful discourse.",
    },
    {
      id: "RPT-002",
      reportedUser: "Emily Chen",
      reportedUserAvatar: "EC",
      contentType: "project",
      contentTitle: "Advanced React Components Library",
      reason: "Spam/Self-promotion",
      status: "reviewed",
      reportedBy: "Michael Davis",
      reportDate: "2024-01-15 11:20",
      description:
        "Project appears to be spam with excessive self-promotion and irrelevant content.",
    },
    {
      id: "RPT-003",
      reportedUser: "David Johnson",
      reportedUserAvatar: "DJ",
      contentType: "comment",
      contentTitle: 'Comment on "Data Science Best Practices"',
      reason: "Harassment",
      status: "resolved",
      reportedBy: "Lisa Anderson",
      reportDate: "2024-01-14 16:45",
      description:
        "User made harassing comments towards other community members in the discussion thread.",
    },
    {
      id: "RPT-004",
      reportedUser: "Maria Garcia",
      reportedUserAvatar: "MG",
      contentType: "review",
      contentTitle: 'Review for "Python for Beginners" course',
      reason: "False Information",
      status: "pending",
      reportedBy: "Tom Rodriguez",
      reportDate: "2024-01-14 09:15",
      description:
        "Review contains misleading information about course content and instructor qualifications.",
    },
    {
      id: "RPT-005",
      reportedUser: "Alex Thompson",
      reportedUserAvatar: "AT",
      contentType: "post",
      contentTitle: "Web Development Career Path",
      reason: "Copyright Violation",
      status: "pending",
      reportedBy: "Jennifer Lee",
      reportDate: "2024-01-13 13:22",
      description:
        "Post contains copyrighted material used without proper attribution or permission.",
    },
  ]);

  // Filter and sort inquiries
  const filteredInquiries = inquiries
    .filter((inquiry) => {
      const matchesSearch =
        inquiry.reportedUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.reason.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || inquiry.status === statusFilter;
      const matchesContentType =
        contentTypeFilter === "all" || inquiry.contentType === contentTypeFilter;
      return matchesSearch && matchesStatus && matchesContentType;
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof InquiryItem];
      const bValue = b[sortField as keyof InquiryItem];
      const direction = sortDirection === "asc" ? 1 : -1;
      return aValue < bValue ? -direction : aValue > bValue ? direction : 0;
    });

  // Pagination derived values
  const totalItems = filteredInquiries.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedInquiries = filteredInquiries.slice(startIndex, endIndex);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      reviewed: "bg-blue-100 text-blue-800 border-blue-300",
      resolved: "bg-green-100 text-green-800 border-green-300",
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "project":
        return <Book className="w-4 h-4 text-purple-600" />;
      case "comment":
        return <MessageCircle className="w-4 h-4 text-blue-600" />;
      case "post":
        return <FileText className="w-4 h-4 text-green-600" />;
      case "review":
        return <Star className="w-4 h-4 text-yellow-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleViewInquiry = (inquiry: InquiryItem) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
  };

  const handleResponseSubmit = (response: string, status: string) => {
    if (selectedInquiry) {
      setInquiries((prev) =>
        prev.map((inquiry) =>
          inquiry.id === selectedInquiry.id
            ? { ...inquiry, status: status as InquiryItem["status"] }
            : inquiry
        )
      );
    }
  };

  // filter from params 
  const allParams = params?.params as string[] | undefined;
  const inquiryType = allParams?.[0];
  const status = allParams?.[1]

  useEffect(() => {
    // filter pending inquiries
    if(status == "pending"){
      setStatusFilter("pending")
    }
  }, [inquiryType]);

  // Fetch inquiries overview stats
  useEffect(() => {
    const loadOverview = async () => {
      setOverviewLoading(true);
      setOverviewError(null);
      try {
        const res = await api.get("/api/v1/inquiries/overview");
        setOverview(res.data as InquiryOverview);
      } catch (err: any) {
        console.error("Failed to load inquiries overview:", err);
        setOverviewError(err?.message || "Failed to load stats");
      } finally {
        setOverviewLoading(false);
      }
    };
    loadOverview();
  }, []);

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, contentTypeFilter]);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertTriangle className="w-10 h-10 text-primary" />
            </div>
            <div className="flex-1 grid gap-1">
              <h1 className="text-3xl font-bold text-gray-900">
                Inquiry Management
              </h1>
              <p className="text-gray-600">
                Review and manage user-submitted inquiries across the platform
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Inquiries
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {overview?.totalInquiries ?? inquiries.length}
                </p>
              </div>
              <div className="p-3 bg-secondary rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {overview?.pending ?? inquiries.filter((r) => r.status === "pending").length}
                </p>
              </div>
              <div className="p-3 bg-yellow-500 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reviewed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {overview?.reviewed ?? inquiries.filter((r) => r.status === "reviewed").length}
                </p>
              </div>
              <div className="p-3 bg-secondary rounded-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {overview?.resolved ?? inquiries.filter((r) => r.status === "resolved").length}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-lg">
                <Check className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {/* Content Type Filter */}
              <select
                value={contentTypeFilter}
                onChange={(e) => setContentTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="project">Projects</option>
                <option value="post">Posts</option>
                <option value="comment">Comments</option>
                <option value="review">Reviews</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {totalItems === 0 ? 0 : startIndex + 1}–{endIndex} of {totalItems} inquiries
            </div>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-gray-700">
              <div
                className="col-span-2 flex items-center cursor-pointer hover:text-gray-900"
                onClick={() => handleSort("id")}
              >
                Inquiry ID
                <ArrowUpDown className="ml-2 w-4 h-4" />
              </div>
              <div
                className="col-span-2 flex items-center cursor-pointer hover:text-gray-900"
                onClick={() => handleSort("reportedUser")}
              >
                Reported User
                <ArrowUpDown className="ml-2 w-4 h-4" />
              </div>
              <div className="col-span-2">Content Type</div>
              <div
                className="col-span-2 flex items-center cursor-pointer hover:text-gray-900"
                onClick={() => handleSort("reason")}
              >
                Reason
                <ArrowUpDown className="ml-2 w-4 h-4" />
              </div>
              <div
                className="col-span-2 flex items-center cursor-pointer hover:text-gray-900"
                onClick={() => handleSort("status")}
              >
                Status
                <ArrowUpDown className="ml-2 w-4 h-4" />
              </div>
              <div className="col-span-2">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {paginatedInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-2">
                  <span className="font-medium text-gray-900">{inquiry.id}</span>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {inquiry.reportedUserAvatar}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {inquiry.reportedUser}
                    </span>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    {getContentTypeIcon(inquiry.contentType)}
                    <span className="capitalize text-gray-700">
                      {inquiry.contentType}
                    </span>
                  </div>
                </div>

                <div className="col-span-2">
                  <span className="text-gray-700">{inquiry.reason}</span>
                </div>

                <div className="col-span-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                      inquiry.status
                    )}`}
                  >
                    {inquiry.status.charAt(0).toUpperCase() +
                      inquiry.status.slice(1)}
                  </span>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewInquiry(inquiry)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleViewInquiry(inquiry)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Respond
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredInquiries.length === 0 && (
            <div className="px-6 py-12 text-center">
              <AlertTriangle className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No inquiries found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
          {/* Pagination Controls */}
          {totalPages > 1 && totalItems > 0 && (
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700">
                Page {safeCurrentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 text-sm border rounded-lg text-gray-700 hover:bg-white disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                >
                  Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 5) page = i + 1;
                  else if (safeCurrentPage <= 3) page = i + 1;
                  else if (safeCurrentPage >= totalPages - 2) page = totalPages - 4 + i;
                  else page = safeCurrentPage - 2 + i;
                  return (
                    <button
                      key={page}
                      className={`px-3 py-1.5 text-sm border rounded-lg ${
                        page === safeCurrentPage
                          ? "bg-[#3D52A0] text-white border-[#3D52A0]"
                          : "text-gray-700 hover:bg-white"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  className="px-3 py-1.5 text-sm border rounded-lg text-gray-700 hover:bg-white disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Response Modal */}
        <ResponseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          inquiry={selectedInquiry}
          onSubmit={handleResponseSubmit}
        />
      </div>
    </div>
  );
}
