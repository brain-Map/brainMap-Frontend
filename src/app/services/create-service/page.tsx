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
  pricings: { pricingType: string; price: string }[];
  deliverables: string[];
  prerequisites: string;
  responseTime: string;
  whatYouGet: WhatYouGetItem[];
  category?: string;
  availabilityModes?: string[];
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
    pricings: [],
    deliverables: [],
    prerequisites: '',
    responseTime: '',
    whatYouGet: [],
    category: '',
    availabilityModes: []
  });


  const updateFormData = (field: keyof ServicePackageFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const allowedPricingTypes = ["hourly", "monthly", "project-based"];

  const availabilityModeOptions = [
    { key: 'HOURLY', label: 'Hourly', pricingType: 'hourly' },
    { key: 'MONTHLY', label: 'Monthly', pricingType: 'monthly' },
    { key: 'PROJECT_BASED', label: 'Project-based', pricingType: 'project-based' },
  ];

  const addPricingRow = () => {
    setFormData(prev => ({ ...prev, pricings: [...prev.pricings, { pricingType: '', price: '' }] }));
  };

  // Update or add pricing by pricingType (used when availability modes require a price)
  const updatePricingByType = (pricingType: string, price: string) => {
    setFormData(prev => {
      const next = [...prev.pricings];
      const idx = next.findIndex(p => p.pricingType === pricingType);
      if (idx >= 0) {
        next[idx] = { ...next[idx], price };
      } else {
        next.push({ pricingType, price });
      }
      return { ...prev, pricings: next };
    });
  };

  // Toggle availability mode and ensure a corresponding pricing entry exists (or is removed)
  const toggleAvailabilityMode = (modeKey: string, pricingType: string) => {
    setFormData(prev => {
      const modes = new Set(prev.availabilityModes || []);
      const pricings = [...prev.pricings];
      if (modes.has(modeKey)) {
        modes.delete(modeKey);
        const nextPricings = pricings.filter(p => p.pricingType !== pricingType);
        return { ...prev, availabilityModes: Array.from(modes), pricings: nextPricings };
      } else {
        modes.add(modeKey);
        if (!pricings.find(p => p.pricingType === pricingType)) {
          pricings.push({ pricingType, price: '' });
        }
        return { ...prev, availabilityModes: Array.from(modes), pricings };
      }
    });
  };

  const updatePricingRow = (index: number, key: 'pricingType' | 'price', value: string) => {
    setFormData(prev => {
      const next = [...prev.pricings];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, pricings: next };
    });
  };

  const removePricingRow = (index: number) => {
    setFormData(prev => ({ ...prev, pricings: prev.pricings.filter((_, i) => i !== index) }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      const { thumbnail } = formData;

      // Validate pricings client-side
      for (const p of formData.pricings) {
        if (!allowedPricingTypes.includes(p.pricingType)) {
          throw new Error('Invalid pricing type: ' + p.pricingType);
        }
        const priceNum = Number(p.price);
        if (isNaN(priceNum) || priceNum <= 0) {
          throw new Error('Each selected availability mode requires an approximate positive price. Please provide a valid price for ' + p.pricingType + '.');
        }
      }

      // Ensure each selected availability mode has a pricing entry
      for (const modeKey of (formData.availabilityModes || [])) {
        const mapping = availabilityModeOptions.find(o => o.key === modeKey);
        if (mapping) {
          const p = formData.pricings.find(x => x.pricingType === mapping.pricingType);
          if (!p) {
            throw new Error(`Please provide an approximate price for ${mapping.label}.`);
          }
          const priceNum = Number(p.price);
          if (isNaN(priceNum) || priceNum <= 0) {
            throw new Error(`Please provide a valid approximate price for ${mapping.label}.`);
          }
        }
      }

      // Prepare payload as per backend requirements
      const packagePayload = {
        title: formData.title,
        category: formData.category,
        availabilityModes: formData.availabilityModes || [],
        description: formData.description,
        pricings: formData.pricings.map(p => ({ pricingType: p.pricingType, price: Number(p.price) })),
        // thumbnail is handled by FormData
        whatYouGet: formData.whatYouGet
      };

      

      data.append('service', new Blob([JSON.stringify(packagePayload)], { type: 'application/json' }));

      if (thumbnail) {
        data.append('thumbnail', thumbnail);
      }
      console.log(packagePayload);
      

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
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => updateFormData('category' as any, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="e.g., Career, Research, Technical"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Availability Modes</label>
                <p className="text-sm text-gray-500 mb-4">Choose how you want to offer this service. Select one or more modes and enter an approximate price for each selected mode.</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  {availabilityModeOptions.map(opt => {
                    const selected = (formData.availabilityModes || []).includes(opt.key);
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => toggleAvailabilityMode(opt.key, opt.pricingType)}
                        className={`relative text-left p-4 rounded-lg border transition-all flex flex-col items-start gap-2 hover:shadow-sm focus:outline-none ${selected ? 'border-blue-500 bg-blue-50 shadow' : 'border-gray-200 bg-white'}`}
                        aria-pressed={selected}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className={`p-2 rounded-md ${selected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                            {/* simple icons by label fallback to Clock/Users/BookOpen */}
                            {opt.pricingType === 'hourly' && <Clock className="w-5 h-5" />}
                            {opt.pricingType === 'monthly' && <Users className="w-5 h-5" />}
                            {opt.pricingType === 'project-based' && <BookOpen className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`font-medium ${selected ? 'text-gray-900' : 'text-gray-800'}`}>{opt.label}</span>
                              {selected && <span className="text-xs text-blue-600 font-medium">Selected</span>}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{opt.label === 'Hourly' ? 'Per hour sessions' : opt.label === 'Monthly' ? 'Ongoing monthly support' : 'Fixed-price project engagement'}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Inline pricing inputs for selected modes */}
                <div className="space-y-3">
                  {availabilityModeOptions.map(opt => {
                    const pricing = formData.pricings.find(p => p.pricingType === opt.pricingType);
                    if (!pricing) return null;
                    return (
                      <div key={opt.key} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3 w-full sm:w-1/3">
                          <div className="p-2 rounded-md bg-white border border-gray-200">
                            {opt.pricingType === 'hourly' && <Clock className="w-5 h-5 text-gray-600" />}
                            {opt.pricingType === 'monthly' && <Users className="w-5 h-5 text-gray-600" />}
                            {opt.pricingType === 'project-based' && <BookOpen className="w-5 h-5 text-gray-600" />}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">{opt.label}</div>
                            <div className="text-xs text-gray-500">Approximate price</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-2/3">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={pricing.price}
                            onChange={(e) => updatePricingByType(opt.pricingType, e.target.value)}
                            placeholder="Price (Rs.)"
                            className="px-3 py-2 border border-gray-300 rounded-lg flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => toggleAvailabilityMode(opt.key, opt.pricingType)}
                            className="text-sm text-red-500 hover:text-red-700"
                            title={`Remove ${opt.label}`}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
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
