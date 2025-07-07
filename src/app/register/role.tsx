'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Upload, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  institution: string;
  areaOfInterest: string;
  linkedIn: string;
  qualification: string;
  expertise: string[];
  experience: string;
  resume: File | null;
  certifications: File[];
  bio: string;
  availability: string;
  termsAccepted: boolean;
}

type FormErrors = {
  [key: string]: string;
};

const UserRegistrationForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<string>();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Get role from URL parameters
  useEffect(() => {
    const role = searchParams.get('role');
    console.log('Role from URL:', role);
    if (role) {
      setUserType(role);
    } else {
      // If no role is provided, redirect to role selection
      router.push('/register');
    }
  }, [searchParams, router]);

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    institution: '',
    areaOfInterest: '',
    linkedIn: '',
    qualification: '',
    expertise: [],
    experience: '',
    resume: null,
    certifications: [],
    bio: '',
    availability: '',
    termsAccepted: false
  });

  const areaOptions = [
    'Web Development', 'Mobile Development', 'Data Science', 'AI/ML', 
    'Cybersecurity', 'DevOps', 'UI/UX Design', 'Blockchain', 'Cloud Computing'
  ];

  const qualificationOptions = [
    'High School', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 
    'Professional Certification', 'Self-taught'
  ];

  const availabilityOptions = [
    'Part-time (10-20 hours/week)', 'Full-time (40+ hours/week)', 
    'Hourly slots (flexible)', 'Weekend only', 'Project-based'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (field: keyof FormData, files: FileList) => {
    if (field === 'certifications') {
      setFormData(prev => ({ ...prev, [field]: Array.from(files) }));
    } else {
      setFormData(prev => ({ ...prev, [field]: files[0] }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: FormErrors = {};

    if (userType === 'Project Member') {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.institution.trim()) newErrors.institution = 'Institution is required';
      if (!formData.areaOfInterest) newErrors.areaOfInterest = 'Area of interest is required';
    } else {
      // Mentor validation by step
      if (step === 1) {
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      } else if (step === 2) {
        if (!formData.qualification) newErrors.qualification = 'Qualification is required';
        if (formData.expertise.length === 0) newErrors.expertise = 'At least one expertise area is required';
        if (!formData.experience) newErrors.experience = 'Years of experience is required';
        if (!formData.resume) newErrors.resume = 'Resume is required';
      } else if (step === 3) {
        if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
        if (!formData.availability) newErrors.availability = 'Availability is required';
        if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userType === 'Project Member') {
      if (!validateStep(1)) return;
    } else {
      if (!validateStep(3)) return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleExpertiseToggle = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...prev.expertise, expertise]
    }));
  };

  const handleBackToRoleSelection = () => {
    router.push('/register');
  };

  // Don't render anything until we have the user type
  if (!userType) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Welcome! Your {userType.toLowerCase()} account has been created successfully.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary hover:text-black transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-(--my-shadow) overflow-hidden">
          {/* Header */}
          <div className="bg-white p-6 text-gray-800 text-center">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleBackToRoleSelection}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Role Selection
              </button>
            </div>
            <h1 className="text-2xl font-bold mb-2">Create Your {userType} Account</h1>
            <p className="text-gray-600">
              {userType === 'Project Member' 
                ? 'Join our community and start learning through real projects'
                : 'Share your expertise and help others grow in their careers'
              }
            </p>
          </div>

          {/* Progress Bar for Mentor */}
          {userType === 'Mentor' && (
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Step {currentStep} of 3</span>
                <span>{Math.round((currentStep / 3) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6">
            {/* Project Member Form */}
            {userType === 'Project Member' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6] focus:border-none transition-colors ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6]  transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6]  transition-colors ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Create a password"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6]  transition-colors ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7091E6]  transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution / University *
                    </label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6]  transition-colors ${
                        errors.institution ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your institution"
                    />
                    {errors.institution && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.institution}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area of Interest *
                  </label>
                  <select
                    value={formData.areaOfInterest}
                    onChange={(e) => handleInputChange('areaOfInterest', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6]  transition-colors ${
                      errors.areaOfInterest ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select your area of interest</option>
                    {areaOptions.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                  {errors.areaOfInterest && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.areaOfInterest}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.linkedIn}
                    onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7091E6]  transition-colors"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-secondary hover:text-black disabled:bg-blue-400 transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            )}

            {/* Mentor Multi-step Form */}
            {userType === 'Mentor' && (
              <>
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6]  transition-colors ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6]  transition-colors ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password *
                        </label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6]  transition-colors ${
                            errors.password ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Create a password"
                        />
                        {errors.password && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.password}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6]  transition-colors ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6]  transition-colors ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your phone number"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn Profile (Optional)
                        </label>
                        <input
                          type="url"
                          value={formData.linkedIn}
                          onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7091E6]  transition-colors"
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleNext}
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary hover:text-black transition-colors flex items-center gap-2"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Professional Information */}
{currentStep === 2 && (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Information</h3>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Highest Qualification *
      </label>
      <select
        value={formData.qualification}
        onChange={(e) => handleInputChange('qualification', e.target.value)}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6]  transition-colors ${
          errors.qualification ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">Select your qualification</option>
        {qualificationOptions.map(qual => (
          <option key={qual} value={qual}>{qual}</option>
        ))}
      </select>
      {errors.qualification && (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors.qualification}
        </p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Areas of Expertise *
      </label>
      <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {areaOptions.map(area => (
          <label key={area} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.expertise.includes(area)}
              onChange={() => handleExpertiseToggle(area)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-[#7091E6]"
            />
            <span className="text-sm text-gray-700">{area}</span>
          </label>
        ))}
      </div>
      {errors.expertise && (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors.expertise}
        </p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Years of Experience *
      </label>
      <select
        value={formData.experience}
        onChange={(e) => handleInputChange('experience', e.target.value)}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6]  transition-colors ${
          errors.experience ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">Select experience level</option>
        <option value="1-2">1-2 years</option>
        <option value="3-5">3-5 years</option>
        <option value="6-10">6-10 years</option>
        <option value="10+">10+ years</option>
      </select>
      {errors.experience && (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors.experience}
        </p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Resume/CV *
      </label>
      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-2">
          {formData.resume ? formData.resume.name : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => e.target.files && handleFileUpload('resume', e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      {errors.resume && (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors.resume}
        </p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Certifications (Optional)
      </label>
      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-2">
          {formData.certifications.length > 0 
            ? `${formData.certifications.length} file(s) selected` 
            : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB each)</p>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          onChange={(e) => e.target.files && handleFileUpload('certifications', e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>

    <div className="flex justify-between">
      <button
        type="button"
        onClick={handleBack}
        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>
      <button
        type="button"
        onClick={handleNext}
        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary hover:text-black transition-colors flex items-center gap-2"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
)}
                {/* Step 3: Additional Information */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Bio *
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6]  transition-colors resize-none ${
                          errors.bio ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Tell us about your professional background, achievements, and what makes you a great mentor..."
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {formData.bio.length}/500 characters
                      </p>
                      {errors.bio && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.bio}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability *
                      </label>
                      <select
                        value={formData.availability}
                        onChange={(e) => handleInputChange('availability', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6]  transition-colors ${
                          errors.availability ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select your availability</option>
                        {availabilityOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      {errors.availability && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.availability}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Institution/Company (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.institution}
                        onChange={(e) => handleInputChange('institution', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7091E6]  transition-colors"
                        placeholder="Enter your current institution or company"
                      />
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={formData.termsAccepted}
                          onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-[#7091E6] mt-1"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                          I agree to the{' '}
                          <a href="/terms" className="text-blue-600 hover:text-blue-700 underline">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                            Privacy Policy
                          </a>
                          . I understand that my profile will be reviewed before approval.
                        </label>
                      </div>
                      {errors.termsAccepted && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.termsAccepted}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between pt-6">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary hover:text-black disabled:bg-blue-400 transition-colors flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                            Creating Account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegistrationForm;