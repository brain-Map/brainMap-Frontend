<<<<<<< HEAD

"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from '@/contexts/AuthContext'; 


interface Package {
  serviceId: string
  title: string
  description: string
  price: number
  duration: string
  features: string[]
  subjectStream: string
  status: string
  createdAt: string
  lastUpdated: string
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { user } = useAuth();

  const mentorId = user?.id

  useEffect(() => {
    if (!mentorId) return;
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    axios.get(`http://localhost:8080/api/v1/service-listings/mentor/${mentorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setPackages(Array.isArray(res.data) ? res.data : [])
        console.log(res.data);
        
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to fetch packages.");
        setLoading(false);
      });
  }, [mentorId]);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`http://localhost:8080/api/v1/service-listings/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPackages(pkgs => pkgs.filter(pkg => pkg.serviceId !== deleteId));
    } catch (err) {
      alert("Failed to delete package.");
    }
    setShowDeleteModal(false);
    setDeleteId(null);
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setDeleteId(null)
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Service Packages</h1>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading packages...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-8 text-gray-400">No packages found.</td>
                  </tr>
                ) : (
                  packages.map(pkg => (
                    <tr key={pkg.serviceId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <a href={`/services/${pkg.serviceId}`} className="text-blue-600 hover:underline font-medium">
                          {pkg.title}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => alert('View not implemented')}
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                          >View</button>
                          <button
                            onClick={() => alert('Edit not implemented')}
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                          >Edit</button>
                          <button
                            onClick={() => handleDeleteClick(pkg.serviceId)}
                            className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
                          >Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this package?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >Cancel</button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
=======
"use client"

import type React from "react"

import { useState } from "react"
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  MoreVertical,
  Filter,
  Search,
  X,
} from "lucide-react"

interface Package {
  id: string
  title: string
  description: string
  price: number
  duration: string
  features: string[]
  subjectStream: string
  status: "active" | "draft" | "archived"
  createdAt: string
  lastUpdated: string
}

interface PackageFormData {
  title: string
  description: string
  price: string
  duration: string
  features: string[]
  subjectStream: string
  status: "active" | "draft" | "archived"
}

export default function PackagesPage() {
  const [activeTab, setActiveTab] = useState<"active" | "draft" | "archived">("active")
  const [selectedStream, setSelectedStream] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)
  
  // Form state
  const [formData, setFormData] = useState<PackageFormData>({
    title: "",
    description: "",
    price: "",
    duration: "",
    features: [""],
    subjectStream: "",
    status: "draft"
  })
  const [formErrors, setFormErrors] = useState<Partial<PackageFormData>>({})

  // Dummy data for packages
  const packages: Package[] = [
    {
      id: "1",
      title: "ML Fundamentals Consultation",
      description: "30-minute session covering machine learning basics and career guidance",
      price: 50,
      duration: "30 minutes",
      features: ["1-on-1 video call", "ML roadmap guidance", "Resource recommendations", "Follow-up email"],
      subjectStream: "Machine Learning",
      status: "active",
      createdAt: "2024-01-15",
      lastUpdated: "2024-12-20",
    },
    {
      id: "2",
      title: "Deep Learning Mentorship",
      description: "Comprehensive mentorship program for deep learning specialization",
      price: 300,
      duration: "8 weeks",
      features: [
        "Weekly 1-hour sessions",
        "Hands-on projects",
        "Code review",
        "Career guidance",
        "Certificate of completion",
      ],
      subjectStream: "Machine Learning",
      status: "active",
      createdAt: "2024-01-10",
      lastUpdated: "2024-12-18",
    },
    {
      id: "3",
      title: "Network Security Basics",
      description: "Introduction to network security concepts and best practices",
      price: 75,
      duration: "2 hours",
      features: ["Security fundamentals", "Threat assessment", "Best practices", "Q&A session"],
      subjectStream: "Networking",
      status: "active",
      createdAt: "2024-01-05",
      lastUpdated: "2024-12-15",
    },
    {
      id: "4",
      title: "Advanced Networking Workshop",
      description: "Deep dive into advanced networking protocols and architecture",
      price: 150,
      duration: "4 hours",
      features: ["Protocol analysis", "Network design", "Troubleshooting", "Hands-on labs"],
      subjectStream: "Networking",
      status: "draft",
      createdAt: "2024-12-01",
      lastUpdated: "2024-12-10",
    },
    {
      id: "5",
      title: "Cloud Computing Fundamentals",
      description: "Introduction to cloud platforms and services",
      price: 100,
      duration: "3 hours",
      features: ["AWS/Azure overview", "Cloud architecture", "Cost optimization", "Migration strategies"],
      subjectStream: "Cloud Computing",
      status: "archived",
      createdAt: "2024-11-01",
      lastUpdated: "2024-11-15",
    },
  ]

  // Get unique subject streams
  const subjectStreams = Array.from(new Set(packages.map(pkg => pkg.subjectStream)))

  // Filter packages based on tab, stream, and search
  const getCurrentPackages = () => {
    return packages.filter(pkg => {
      const matchesTab = pkg.status === activeTab
      const matchesStream = selectedStream === "all" || pkg.subjectStream === selectedStream
      const matchesSearch = searchQuery === "" || 
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.subjectStream.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesTab && matchesStream && matchesSearch
    })
  }

  const getTabCount = (tab: "active" | "draft" | "archived") => {
    return packages.filter(pkg => pkg.status === tab).length
  }

  const handleDeletePackage = (packageId: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      // Handle deletion logic here
      console.log("Deleting package:", packageId)
    }
  }

  const handleEditPackage = (pkg: Package) => {
    setEditingPackage(pkg)
    setShowCreateModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      duration: "",
      features: [""],
      subjectStream: "",
      status: "draft"
    })
    setFormErrors({})
  }

  const handleCreatePackage = () => {
    setEditingPackage(null)
    resetForm()
    setShowCreateModal(true)
  }

  const handleCloseModal = () => {
    setShowCreateModal(false)
    setEditingPackage(null)
    resetForm()
  }

  const handleInputChange = (field: keyof PackageFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }))
  }

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }))
  }

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        features: newFeatures
      }))
    }
  }

  const validateForm = (): boolean => {
    const errors: Partial<PackageFormData> = {}

    if (!formData.title.trim()) errors.title = "Title is required"
    if (!formData.description.trim()) errors.description = "Description is required"
    if (!formData.price.trim()) errors.price = "Price is required"
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errors.price = "Price must be a valid positive number"
    }
    if (!formData.duration.trim()) errors.duration = "Duration is required"
    if (!formData.subjectStream.trim()) errors.subjectStream = "Subject stream is required"
    
    const validFeatures = formData.features.filter(f => f.trim())
    if (validFeatures.length === 0) errors.features = ["At least one feature is required"]

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // Filter out empty features
    const validFeatures = formData.features.filter(f => f.trim())
    
    const packageData = {
      ...formData,
      price: Number(formData.price),
      features: validFeatures,
      id: editingPackage?.id || Date.now().toString(),
      createdAt: editingPackage?.createdAt || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    }

    console.log("Package data:", packageData)
    // Here you would typically send the data to your backend
    
    handleCloseModal()
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Service Packages</h1>
              <p className="mt-2 text-gray-600">Manage your mentorship and consultation service offerings</p>
            </div>
            <button 
              onClick={handleCreatePackage}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Package
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Subject Stream Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Streams</option>
                {subjectStreams.map(stream => (
                  <option key={stream} value={stream}>{stream}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: "active", label: "Active" },
                { key: "draft", label: "Drafts" },
                { key: "archived", label: "Archived" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label} ({getTabCount(tab.key as any)})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getCurrentPackages().map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Package Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{pkg.title}</h3>
                  </div>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
                    {pkg.subjectStream}
                  </span>
                  <p className="text-sm text-gray-600">{pkg.description}</p>
                </div>
                <div className="relative">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">${pkg.price}</span>
                  <span className="ml-1 text-sm text-gray-500">/ {pkg.duration}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-6">
                {pkg.features.map((feature, j) => (
                  <div key={j} className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Updated {new Date(pkg.lastUpdated).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditPackage(pkg)}
                    className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="flex items-center px-3 py-1 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {getCurrentPackages().length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No packages found</h3>
            <p className="mt-2 text-gray-500">
              {searchQuery || selectedStream !== "all" 
                ? "Try adjusting your search or filters."
                : activeTab === "active"
                  ? "You don't have any active packages yet."
                  : activeTab === "draft"
                    ? "No draft packages to show."
                    : "No archived packages to show."
              }
            </p>
            {!searchQuery && selectedStream === "all" && (
              <button 
                onClick={handleCreatePackage}
                className="mt-4 flex items-center mx-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Package
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Package Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingPackage ? "Edit Package" : "Create New Package"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Package Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.title ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="e.g., ML Fundamentals Consultation"
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.description ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Describe what this package offers..."
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                )}
              </div>

              {/* Price and Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.price ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="50"
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.duration ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="e.g., 30 minutes, 2 hours, 4 weeks"
                  />
                  {formErrors.duration && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.duration}</p>
                  )}
                </div>
              </div>

              {/* Subject Stream */}
              <div>
                <label htmlFor="subjectStream" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Stream *
                </label>
                <input
                  type="text"
                  id="subjectStream"
                  value={formData.subjectStream}
                  onChange={(e) => handleInputChange("subjectStream", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.subjectStream ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="e.g., Machine Learning, Networking, Cloud Computing"
                />
                {formErrors.subjectStream && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.subjectStream}</p>
                )}
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Package Features *
                  </label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 1-on-1 video call"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {formErrors.features && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.features[0]}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingPackage ? "Update Package" : "Create Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
>>>>>>> 3144da3d49b13a976f5960b6e1ebe41f71fc561e
