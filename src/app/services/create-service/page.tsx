'use client'

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { 
  Camera, 
  X, 
  Upload, 
  Clock, 
  Users, 
  BookOpen,
  CheckCircle,
  FileText,
  Package,
  Sparkles,
  Plus,
  Trash2
} from 'lucide-react';

interface WhatYouGetItem {
  title: string;
  description: string;
}

interface ServicePackageFormData {
  title: string;
  description: string;
  thumbnail: File | null;
  hourlyRatePerPerson: string;
  hourlyRatePerGroup: string;
  deliverables: string[];
  prerequisites: string;
  subject: string;
  responseTime: string;
  whatYouGet: WhatYouGetItem[];
}

interface Availability {
  dayOfWeek: number; // 1 = Monday, ..., 7 = Sunday
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

export default function CreateServicePackage() {
  const { user } = useAuth();
  const token = localStorage.getItem('accessToken');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tagInput, setTagInput] = useState<string>('');
  const [deliverableInput, setDeliverableInput] = useState<string>('');
  const [whatYouGetInput, setWhatYouGetInput] = useState<WhatYouGetItem>({
    title: '',
    description: '',
  });
  console.log(token);
  
  const [formData, setFormData] = useState<ServicePackageFormData>({
    title: '',
    description: '',
    thumbnail: null,
    hourlyRatePerPerson: '',
    hourlyRatePerGroup: '',
    deliverables: [],
    prerequisites: '',
    subject: '',
    responseTime: '',
    whatYouGet: []
  });

  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [availabilityInput, setAvailabilityInput] = useState<Availability>({
    dayOfWeek: 1,
    startTime: '',
    endTime: ''
  });

  const dayNames = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      const { thumbnail } = formData;

      // Prepare availabilities for backend
      const availabilitiesPayload = availabilities.map(a => ({
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime
      }));

      // Prepare payload as per backend requirements
      const packagePayload = {
        title: formData.title,
        subject: formData.subject,
        description: formData.description,
        hourlyRatePerPerson: Number(formData.hourlyRatePerPerson),
        hourlyRatePerGroup: Number(formData.hourlyRatePerGroup),
        // thumbnail is handled by FormData
        availabilities: availabilitiesPayload,
        whatYouGet: formData.whatYouGet
      };

      

      data.append('service', new Blob([JSON.stringify(packagePayload)], { type: 'application/json' }));

      if (thumbnail) {
        data.append('thumbnail', thumbnail);
      }

      await axios.post(
        `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/service-listings/${user?.id}/create`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Service package created successfully!');
      // Optionally redirect to packages list
    } catch (error: any) {
      alert('Failed to create package: ' + (error?.response?.data?.message || error.message));
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
            <h1 className="text-3xl font-bold text-primary mb-2">Create Service Package</h1>
            <p className="text-gray-600">Design and offer your mentorship services</p>
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
                    <div className="flex gap-4">
                      <label className="cursor-pointer flex flex-col items-center px-6 py-3 bg-white/90 hover:bg-white rounded-lg transition-all transform hover:scale-105 shadow-lg">
                        <Camera className="w-6 h-6 text-primary mb-1" />
                        <span className="text-sm font-medium text-gray-800">Change</span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleThumbnailUpload(file);
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="flex flex-col items-center px-6 py-3 bg-red-500/90 hover:bg-red-600 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg"
                      >
                        <X className="w-6 h-6 mb-1" />
                        <span className="text-sm font-medium">Remove</span>
                      </button>
                    </div>
                  </div>
                  {/* Image info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white text-sm font-medium">Thumbnail Preview</p>
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
                    <div className={`rounded-full p-4 mb-4 ${dragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <Upload className={`h-12 w-12 ${dragActive ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      {dragActive ? 'Drop your image here' : 'Upload thumbnail'}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Drag and drop or{' '}
                      <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                        browse
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleThumbnailUpload(file);
                          }}
                        />
                      </label>
                    </p>
                    <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <select
                  value={formData.subject}
                  onChange={(e) => updateFormData('subject', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  required
                >
                  <option value="">Select subject</option>
                  <option value="career-development">Career Development</option>
                  <option value="technical-skills">Technical Skills</option>
                  <option value="leadership">Leadership</option>
                  <option value="entrepreneurship">Entrepreneurship</option>
                  <option value="personal-growth">Personal Growth</option>
                  <option value="academic">Academic</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate Per Person (Rs.) *</label>
                  <input
                    type="number"
                    value={formData.hourlyRatePerPerson}
                    onChange={(e) => updateFormData('hourlyRatePerPerson', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="e.g., 500"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate Per Group (Rs.) *</label>
                  <input
                    type="number"
                    value={formData.hourlyRatePerGroup}
                    onChange={(e) => updateFormData('hourlyRatePerGroup', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="e.g., 2000"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* ...removed Mentorship Type and Pricing Section... */}

            {/* What You'll Get Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary flex items-center">
                <CheckCircle className="w-6 h-6 mr-2" />
                What You&apos;ll Get
              </h2>
              <p className="text-sm text-gray-600">Add the key benefits and deliverables of your service</p>
              
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Title *</label>
                  <input
                    type="text"
                    value={whatYouGetInput.title}
                    onChange={(e) => setWhatYouGetInput(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="e.g., Personalized Career Roadmap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
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

              {/* List of What You'll Get items */}
              {formData.whatYouGet.length > 0 && (
                <div className="space-y-3">
                  {formData.whatYouGet.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeWhatYouGetItem(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
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
              {/* List of availabilities */}
              {availabilities.length > 0 && (
                <div className="mt-4">
                  <table className="min-w-full border text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-3 py-2 border">Day</th>
                        <th className="px-3 py-2 border">Start Time</th>
                        <th className="px-3 py-2 border">End Time</th>
                        <th className="px-3 py-2 border"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {availabilities.map((a, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2 border">{dayNames[a.dayOfWeek - 1]}</td>
                          <td className="px-3 py-2 border">{a.startTime}</td>
                          <td className="px-3 py-2 border">{a.endTime}</td>
                          <td className="px-3 py-2 border text-center">
                            <button
                              type="button"
                              onClick={() => removeAvailability(idx)}
                              className="text-red-500 hover:text-red-700"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                Create Package
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
