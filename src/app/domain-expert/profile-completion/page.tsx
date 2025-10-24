'use client'
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, User, BookOpen, Award, Upload, Phone, Mail, MapPin, Calendar, Clock, DollarSign, Users, Plus, Trash2, FileText, Image, File as FileIcon, X, Camera } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';

interface Education {
  degree: string;
  school: string;
  year: string;
}

interface ExpertiseArea {
  expertise: string;
  experience: string;
}

interface MentorFormData {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  location: string;
  gender: string;
  profilePhoto: File | null;
  expertiseAreas: ExpertiseArea[];
  bio: string;
  education: Education[];
  workExperience: string;
  verificationDocs: File[];
  linkedinProfile: string;
  portfolio: string;
}

export default function MentorRegistrationForm() {
  const { user } = useAuth();
  const router = useRouter();
  const { show: showToast } = useToast();
  const token = localStorage.getItem('accessToken');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState<MentorFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    location: '',
    gender: '',
    profilePhoto: null,
    expertiseAreas: [{ expertise: '', experience: '' }],
    bio: '',
    education: [{ degree: '', school: '', year: '' }],
    workExperience: '',
    verificationDocs: [],
    linkedinProfile: '',
    portfolio: ''
  });

  const updateFormData = (field: keyof MentorFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePhotoUpload = (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Profile photo is too large. Maximum size is 5MB.');
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
    updateFormData('profilePhoto', new File([file], file.name, { type: file.type }));
  };

  const removeProfilePhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    updateFormData('profilePhoto', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', school: '', year: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addExpertiseArea = () => {
    setFormData(prev => ({
      ...prev,
      expertiseAreas: [...prev.expertiseAreas, { expertise: '', experience: '' }]
    }));
  };

  const removeExpertiseArea = (index: number) => {
    setFormData(prev => ({
      ...prev,
      expertiseAreas: prev.expertiseAreas.filter((_, i) => i !== index)
    }));
  };

  const updateExpertiseArea = (index: number, field: keyof ExpertiseArea, value: string) => {
    setFormData(prev => ({
      ...prev,
      expertiseAreas: prev.expertiseAreas.map((area, i) =>
        i === index ? { ...area, [field]: value } : area
      )
    }));
  };

  const handleVerificationDocUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png'
      ];
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not supported. Please upload PDF, DOC, DOCX, JPG, or PNG files.`);
        return false;
      }
      return true;
    });
    if (newFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        verificationDocs: [...prev.verificationDocs, ...newFiles]
      }));
    }
  };

  const removeVerificationDoc = (index: number) => {
    setFormData(prev => ({
      ...prev,
      verificationDocs: prev.verificationDocs.filter((_, i) => i !== index)
    }));
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
      handleVerificationDocUpload(e.dataTransfer.files);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="w-5 h-5 text-red-500" />;
    } else if (fileType.includes('image')) {
      return <Image className="w-5 h-5 text-blue-500" />;
    } else if (fileType.includes('document') || fileType.includes('msword')) {
      return <FileText className="w-5 h-5 text-blue-600" />;
    }
    return <FileIcon className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const data = new FormData();
      const {
        profilePhoto,
        verificationDocs,
        expertiseAreas,
        education,
        ...rest
      } = formData;

      const profilePayload = {
        ...rest,
        expertiseAreas,
        education
      };

      data.append('profile', new Blob([JSON.stringify(profilePayload)], { type: 'application/json' }));

      if (profilePhoto) {
        data.append('profilePhoto', profilePhoto);
      }
      verificationDocs.forEach(f => data.append('verificationDocs', f));

      await axios.post(
        `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/domain-experts/${user?.id}/profile-complete`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast('Profile completed successfully!', 'success');
      router.push('/domain-expert/dashboard');
    } catch (error: any) {
      showToast('Submission failed: ' + (error?.response?.data?.message || error.message), 'error');
    }
  };

  const steps = [
    { number: 1, title: 'Personal Details', icon: User },
    { number: 2, title: 'Mentoring Details', icon: BookOpen },
    { number: 3, title: 'Qualifications', icon: Award }
  ];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 ">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;
        
        return (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
              isActive ? 'bg-primary border-primary text-white' :
              isCompleted ? 'bg-blue-500 border-blue-500 text-white' :
              'bg-white border-gray-300 text-gray-400'
            }`}>
              <Icon size={20} />
            </div>
            <div className="ml-3 mr-8">
              <p className={`text-sm font-medium ${
                isActive ? 'text-primary' : isCompleted ? 'text-blue-500' : 'text-gray-400'
              }`}>
                Step {step.number}
              </p>
              <p className={`text-xs ${
                isActive ? 'text-blue-800' : isCompleted ? 'text-blue-400' : 'text-gray-400'
              }`}>
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className={`w-5 h-5 mx-4 ${
                isCompleted ? 'text-blue-500' : 'text-gray-300'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderPersonalDetails = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Personal Information</h2>
      {/* Profile Photo Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Profile Photo *
            <span className="text-xs text-gray-500 ml-2">(Recommended for better profile visibility)</span>
          </label>
          <div className="flex flex-col items-center">
            <div className="relative w-56 h-56 mb-2"> {/* Increased size from w-40 h-40 to w-56 h-56 */}
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover rounded-full border-2 border-gray-300 shadow"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50">
                  <Camera className="w-14 h-14 text-gray-400" /> {/* Increased icon size */}
                </div>
              )}
              {/* Overlay for change/remove */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30 rounded-full">
                <label className="cursor-pointer flex flex-col items-center">
                  <Camera className="w-8 h-8 text-white mb-1" /> {/* Increased icon size */}
                  <span className="text-xs text-white">Change Photo</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleProfilePhotoUpload(file);
                    }}
                  />
                </label>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={removeProfilePhoto}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    title="Remove photo"
                  >
                    <X className="w-5 h-5" /> {/* Increased icon size */}
                  </button>
                )}
              </div>
            </div>
            {!photoPreview && (
              <label className="mt-2 text-blue-600 cursor-pointer font-medium">
                Upload Photo
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleProfilePhotoUpload(file);
                  }}
                />
              </label>
            )}
            <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
          </div>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            placeholder="Enter your first name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="+123456789"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => updateFormData('location', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            placeholder="Enter your Location"
          />
        </div>
        
      </div>

      {/* Gender field */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => updateFormData('gender', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderMentoringDetails = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Mentoring Information</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Expertise *</label>
        {formData.expertiseAreas.map((area, index) => (
          <div key={index} className="flex gap-4 mb-2 items-center">
            <select
              value={area.expertise}
              onChange={(e) => updateExpertiseArea(index, 'expertise', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            >
              <option value="">Select expertise</option>
              <option value="software-development">Software Development</option>
              <option value="data-science">Data Science</option>
              <option value="product-management">Product Management</option>
              <option value="marketing">Marketing</option>
              <option value="entrepreneurship">Entrepreneurship</option>
              <option value="design">Design</option>
              <option value="finance">Finance</option>
              <option value="consulting">Consulting</option>
            </select>
            <select
              value={area.experience}
              onChange={(e) => updateExpertiseArea(index, 'experience', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            >
              <option value="">Years of experience</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
            {formData.expertiseAreas.length > 1 && (
              <button
                type="button"
                onClick={() => removeExpertiseArea(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addExpertiseArea}
          className="flex items-center px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Expertise Area
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio & Approach *</label>
        <textarea
          value={formData.bio}
          onChange={(e) => updateFormData('bio', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          rows={6}
          placeholder="Tell us about yourself, your background, and your mentoring approach. What makes you unique as a mentor?"
        />
      </div>
    </div>
  );

  const renderQualifications = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Qualifications & Verification</h2>
      
      {/* Education Section - existing code */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">Education *</label>
          <button
            type="button"
            onClick={addEducation}
            className="flex items-center px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Education
          </button>
        </div>
        
        {formData.education.map((edu, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium text-gray-700">Education {index + 1}</h4>
              {formData.education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Degree *</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-sm"
                  placeholder="Bachelor of Science"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">School/Institute *</label>
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => updateEducation(index, 'school', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-sm"
                  placeholder="University of Example"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Year *</label>
                <input
                  type="number"
                  value={edu.year}
                  onChange={(e) => updateEducation(index, 'year', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-sm"
                  placeholder="2020"
                  min="1950"
                  max="2030"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Work Experience *</label>
        <textarea
          value={formData.workExperience}
          onChange={(e) => updateFormData('workExperience', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          rows={5}
          placeholder="Describe your professional experience, key roles, and achievements"
        />
      </div>

      {/* Enhanced Verification Documents Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Verification Documents *
          <span className="text-xs text-gray-500 ml-2">
            ({formData.verificationDocs.length} file{formData.verificationDocs.length !== 1 ? 's' : ''} uploaded)
          </span>
        </label>
        
        {/* Enhanced Upload Area with Drag & Drop */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
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
            <div className={`rounded-full p-3 mb-4 ${dragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Upload className={`h-8 w-8 ${dragActive ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-lg font-medium text-gray-700">
                {dragActive ? 'Drop your files here' : 'Upload your documents'}
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop files here, or{' '}
                <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                  browse
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleVerificationDocUpload(e.target.files)}
                    className="sr-only"
                  />
                </label>
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                Supported formats: PDF, DOC, DOCX, JPG, PNG
              </p>
              <p className="text-xs text-gray-500">
                Maximum file size: 10MB per file
              </p>
            </div>
          </div>

          {/* Overlay for drag state */}
          {dragActive && (
            <div className="absolute inset-0 bg-blue-50 bg-opacity-75 flex items-center justify-center rounded-lg">
              <div className="text-blue-600 font-medium">
                Release to upload files
              </div>
            </div>
          )}
        </div>

        {/* File Type Suggestions */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-primary mb-2">Recommended Documents:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-700">
            <div className="flex items-center">
              <FileText className="w-3 h-3 mr-1" />
              Resume/CV
            </div>
            <div className="flex items-center">
              <FileText className="w-3 h-3 mr-1" />
              Certificates
            </div>
            <div className="flex items-center">
              <FileText className="w-3 h-3 mr-1" />
              Portfolio
            </div>
            <div className="flex items-center">
              <FileText className="w-3 h-3 mr-1" />
              Transcripts
            </div>
          </div>
        </div>

        {/* Enhanced Uploaded Files List */}
        {formData.verificationDocs.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-medium text-gray-700 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Uploaded Documents ({formData.verificationDocs.length})
            </h4>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {formData.verificationDocs.map((file, index) => (
                <div key={index} className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center flex-1 min-w-0">
                    {getFileIcon(file.type)}
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center mt-1 space-x-3">
                        <span className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {file.type.split('/')[1].toUpperCase()}
                        </span>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          Uploaded
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeVerificationDoc(index)}
                    className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Upload Summary */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
              <span className="text-gray-600">
                Total: {formData.verificationDocs.length} file{formData.verificationDocs.length !== 1 ? 's' : ''}
              </span>
              <span className="text-gray-600">
                Size: {formatFileSize(formData.verificationDocs.reduce((total, file) => total + file.size, 0))}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
          <input
            type="url"
            value={formData.linkedinProfile}
            onChange={(e) => updateFormData('linkedinProfile', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio/Website</label>
          <input
            type="url"
            value={formData.portfolio}
            onChange={(e) => updateFormData('portfolio', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            placeholder="https://yourportfolio.com"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Become a Mentor</h1>
            <p className="text-gray-600">Join our community of expert mentors and make a difference</p>
          </div>

          {renderStepIndicator()}

          <div className="min-h-96">
            {currentStep === 1 && renderPersonalDetails()}
            {currentStep === 2 && renderMentoringDetails()}
            {currentStep === 3 && renderQualifications()}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                className="flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Submit Application
                <Award className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}