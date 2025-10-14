// Edit Service Page
'use client'
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Sparkles, CheckCircle, Clock, Plus, Trash2 } from 'lucide-react';

interface WhatYouGetItem {
  title: string;
  description: string;
}

interface ServicePackageFormData {
  title: string;
  description: string;
  thumbnail: File | null;
  mentorshipType: string;
  priceType: 'fixed' | 'flexible';
  price: string;
  priceMin: string;
  priceMax: string;
  duration: string;
  sessionsIncluded: string;
  maxParticipants: string;
  deliverables: string[];
  prerequisites: string;
  subject: string;
  serviceType: string;
  responseTime: string;
  whatYouGet: WhatYouGetItem[];
}

interface Availability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export default function EditServicePackage() {
  const params = useParams();
  const serviceId = typeof params.serviceId === 'string' ? params.serviceId : Array.isArray(params.serviceId) ? params.serviceId[0] : '';
  const { user } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tagInput, setTagInput] = useState<string>('');
  const [deliverableInput, setDeliverableInput] = useState<string>('');
  const [whatYouGetInput, setWhatYouGetInput] = useState<WhatYouGetItem>({
    title: '',
    description: '',
  });

  const [formData, setFormData] = useState<ServicePackageFormData>({
    title: '',
    description: '',
    thumbnail: null,
    mentorshipType: '',
    priceType: 'fixed',
    price: '',
    priceMin: '',
    priceMax: '',
    duration: '',
    sessionsIncluded: '',
    maxParticipants: '',
    deliverables: [],
    prerequisites: '',
    subject: '',
    serviceType: '',
    responseTime: '',
    whatYouGet: []
  });

  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [availabilityInput, setAvailabilityInput] = useState<Availability>({
    dayOfWeek: 1,
    startTime: '',
    endTime: ''
  });

  // Helper for day names
  const dayNames = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  // Fetch service data on mount
  useEffect(() => {
    async function fetchService() {
      try {
        const res = await axios.get(
          `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/service-listings/${serviceId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const service = res.data;
        setFormData({
          title: service.title || '',
          description: service.description || '',
          thumbnail: null,
          mentorshipType: service.mentorshipType || '',
          priceType: service.pricingType || 'fixed',
          price: service.minPrice?.toString() || '',
          priceMin: service.minPrice?.toString() || '',
          priceMax: service.maxPrice?.toString() || '',
          duration: service.duration || '',
          sessionsIncluded: service.sessionsIncluded || '',
          maxParticipants: service.maxParticipants || '',
          deliverables: service.deliverables || [],
          prerequisites: service.prerequisites || '',
          subject: service.subject || '',
          serviceType: service.serviceType || '',
          responseTime: service.responseTime || '',
          whatYouGet: service.whatYouGet || []
        });
        setAvailabilities(service.availabilities || []);
        if (service.thumbnailUrl) setPhotoPreview(`http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/${service.thumbnailUrl}`);
      } catch (err) {
        alert('Failed to fetch service data');
      }
    }
    if (serviceId) fetchService();
  }, [serviceId, token]);

  const updateFormData = (field: keyof ServicePackageFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleThumbnailUpload = (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Thumbnail is too large. Maximum size is 5MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, GIF, etc.).');
      return;
    }
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
    updateFormData('thumbnail', new File([file], file.name, { type: file.type }));
  };

  const removeThumbnail = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    updateFormData('thumbnail', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleThumbnailUpload(e.dataTransfer.files[0]);
    }
  };

  const addDeliverable = () => {
    if (deliverableInput.trim() && !formData.deliverables.includes(deliverableInput.trim())) {
      updateFormData('deliverables', [...formData.deliverables, deliverableInput.trim()]);
      setDeliverableInput('');
    }
  };

  const removeDeliverable = (index: number) => {
    updateFormData('deliverables', formData.deliverables.filter((_, i) => i !== index));
  };

  const addWhatYouGetItem = () => {
    if (whatYouGetInput.title.trim() && whatYouGetInput.description.trim()) {
      updateFormData('whatYouGet', [...formData.whatYouGet, { ...whatYouGetInput }]);
      setWhatYouGetInput({ title: '', description: '' });
    } else {
      alert('Please provide both title and description.');
    }
  };

  const removeWhatYouGetItem = (index: number) => {
    updateFormData('whatYouGet', formData.whatYouGet.filter((_, i) => i !== index));
  };

  const addAvailability = () => {
    if (
      availabilityInput.startTime &&
      availabilityInput.endTime &&
      availabilityInput.startTime < availabilityInput.endTime
    ) {
      setAvailabilities(prev => [...prev, { ...availabilityInput }]);
      setAvailabilityInput({ dayOfWeek: 1, startTime: '', endTime: '' });
    } else {
      alert('Please select valid start and end times.');
    }
  };

  const removeAvailability = (index: number) => {
    setAvailabilities(prev => prev.filter((_, i) => i !== index));
  };

  // Submit handler for editing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const availabilitiesPayload = availabilities.map(a => ({
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime
      }));
      const packagePayload: any = {
        title: formData.title,
        subject: formData.subject,
        description: formData.description,
        pricingType: formData.priceType,
        minPrice: Number(formData.priceMin),
        maxPrice: formData.priceType === 'flexible' ? Number(formData.priceMax) : null,
        serviceType: formData.serviceType,
        mentorshipType: formData.mentorshipType,
        availabilities: availabilitiesPayload,
        whatYouGet: formData.whatYouGet,
        deliverables: formData.deliverables,
        prerequisites: formData.prerequisites,
        responseTime: formData.responseTime
      };

      const data = new FormData();
      data.append('service', new Blob([JSON.stringify(packagePayload)], { type: 'application/json' }));
      if (formData.thumbnail && formData.thumbnail instanceof File) {
        data.append('thumbnail', formData.thumbnail);
      }

      await axios.put(
        `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/service-listings/${serviceId}/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert('Service package updated successfully!');
      window.location.href = `/services/${serviceId}`;
    } catch (error: any) {
      alert('Failed to update package: ' + (error?.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Edit Service Package</h1>
            <p className="text-gray-600">Update your mentorship service details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Thumbnail Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Thumbnail *
                <span className="text-xs text-gray-500 ml-2">(Recommended: 1200x600px)</span>
              </label>
              {photoPreview ? (
                <div className="relative w-full h-80 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                  <img
                    src={photoPreview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow"
                      onClick={removeThumbnail}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <span className="text-white text-xs">
                      {formData.thumbnail ? formData.thumbnail.name : 'Current Thumbnail'}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center">
                    <Package className="w-10 h-10 text-primary mb-2" />
                    <p className="text-gray-600 mb-2">Drag & drop an image here, or</p>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          handleThumbnailUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="cursor-pointer px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-800 transition-colors shadow"
                    >
                      Upload Image
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary flex items-center">
                <Sparkles className="w-6 h-6 mr-2" />
                Package Details
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="e.g., Career Mentorship Program"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  rows={6}
                  placeholder="Describe what this package includes, who it's for, and what mentees will achieve..."
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col justify-center h-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => updateFormData('subject', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="e.g., Data Science, Career Guidance"
                    required
                  />
                </div>
                <div className="flex flex-col justify-center h-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
                  <input
                    type="text"
                    value={formData.serviceType}
                    onChange={(e) => updateFormData('serviceType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="e.g., Mentorship, Consulting"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Mentorship Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Mentorship Type *</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['One-on-One', 'Group Sessions', 'Both'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                      formData.mentorshipType === type
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                    }`}
                    onClick={() => updateFormData('mentorshipType', type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary flex items-center">
                Pricing
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Price Type *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                      formData.priceType === 'fixed'
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                    }`}
                    onClick={() => updateFormData('priceType', 'fixed')}
                  >
                    Fixed Price
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                      formData.priceType === 'flexible'
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                    }`}
                    onClick={() => updateFormData('priceType', 'flexible')}
                  >
                    Flexible Price
                  </button>
                </div>
              </div>
              {formData.priceType === 'fixed' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.priceMin}
                    onChange={e => updateFormData('priceMin', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="e.g., 100"
                    required
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Price *</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.priceMin}
                      onChange={e => updateFormData('priceMin', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="e.g., 100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Price *</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.priceMax}
                      onChange={e => updateFormData('priceMax', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="e.g., 500"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* What You'll Get Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary flex items-center">
                <CheckCircle className="w-6 h-6 mr-2" />
                What You&apos;ll Get
              </h2>
              <p className="text-sm text-gray-600">Add the key benefits and deliverables of your service</p>
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={whatYouGetInput.title}
                    onChange={(e) => setWhatYouGetInput(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="e.g., Personalized Career Roadmap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={whatYouGetInput.description}
                    onChange={(e) => setWhatYouGetInput(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    rows={2}
                    placeholder="Brief description of what this includes..."
                  />
                </div>
                <button
                  type="button"
                  onClick={addWhatYouGetItem}
                  className="flex items-center px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-800 transition-colors shadow"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </button>
              </div>
              {formData.whatYouGet.length > 0 && (
                <div className="space-y-3">
                  {formData.whatYouGet.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-white rounded-lg shadow p-3">
                      <div>
                        <div className="font-semibold text-primary">{item.title}</div>
                        <div className="text-gray-600 text-sm">{item.description}</div>
                      </div>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => removeWhatYouGetItem(index)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Service Availability Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary flex items-center">
                <Clock className="w-6 h-6 mr-2" />
                Service Availability
              </h2>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Day of Week</label>
                  <select
                    value={availabilityInput.dayOfWeek}
                    onChange={e => setAvailabilityInput(ai => ({
                      ...ai,
                      dayOfWeek: Number(e.target.value)
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {dayNames.map((name, idx) => (
                      <option key={idx} value={idx + 1}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={availabilityInput.startTime}
                    onChange={e => setAvailabilityInput(ai => ({
                      ...ai,
                      startTime: e.target.value
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={availabilityInput.endTime}
                    onChange={e => setAvailabilityInput(ai => ({
                      ...ai,
                      endTime: e.target.value
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={addAvailability}
                  className="flex items-center px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-800 transition-colors shadow"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>
              {availabilities.length > 0 && (
                <div className="mt-4">
                  {availabilities.map((a, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white rounded-lg shadow p-3 mb-2">
                      <div>
                        <span className="font-semibold text-primary">{dayNames[a.dayOfWeek - 1]}</span>
                        <span className="ml-2 text-gray-600 text-sm">
                          {a.startTime} - {a.endTime}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => removeAvailability(idx)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="flex items-center px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-md hover:shadow-lg"
              >
                <Package className="w-5 h-5 mr-2" />
                Update Package
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
