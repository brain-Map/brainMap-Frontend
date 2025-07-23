'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Upload, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileData {
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
  // New fields for personal details
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  city: string;
  address: string;
  github: string;
  portfolio: string;
  twitter: string;
  currentPosition: string;
  yearsOfStudy: string;
  major: string;
}

type FormErrors = {
  [key: string]: string;
};

const ProfileCompletion = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<string>();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { user } = useAuth();

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
  const [profileData, setProfileData] = useState<ProfileData>({
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
    termsAccepted: false,
    // New fields
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    city: '',
    address: '',
    github: '',
    portfolio: '',
    twitter: '',
    currentPosition: '',
    yearsOfStudy: '',
    major: ''
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

  const genderOptions = [
    'Male', 'Female', 'Prefer not to say'
  ];

  const yearsOfStudyOptions = [
    '1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate', 'PhD Student'
  ];

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (field: keyof ProfileData, files: FileList) => {
    if (field === 'certifications') {
      setProfileData(prev => ({ ...prev, [field]: Array.from(files) }));
    } else {
      setProfileData(prev => ({ ...prev, [field]: files[0] }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      // Personal details step
      if (!profileData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!profileData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!profileData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!profileData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!profileData.city.trim()) newErrors.city = 'City is required';
      
      if (userType === 'Project Member') {
        if (!profileData.institution.trim()) newErrors.institution = 'Institution is required';
        if (!profileData.areaOfInterest) newErrors.areaOfInterest = 'Area of interest is required';
        if (!profileData.yearsOfStudy) newErrors.yearsOfStudy = 'Year of study is required';
        if (!profileData.major.trim()) newErrors.major = 'Major/Field of study is required';
      }
    } else if (step === 2 && userType === 'Mentor') {
      // Mentor qualifications step
      if (!profileData.qualification) newErrors.qualification = 'Qualification is required';
      if (profileData.expertise.length === 0) newErrors.expertise = 'At least one expertise area is required';
      if (!profileData.experience) newErrors.experience = 'Years of experience is required';
      if (!profileData.resume) newErrors.resume = 'Resume is required';
      if (!profileData.bio.trim()) newErrors.bio = 'Bio is required';
      if (!profileData.availability) newErrors.availability = 'Availability is required';
      if (!profileData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
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

  const handleFinalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalStep = userType === 'Project Member' ? 0 : 1;
    if (!validateStep(finalStep)) return;
    
    setIsSubmitting(true);
    
    try {
      const accessToken = localStorage.getItem("accessToken");
      const role = userType || "";
      const userRole = role.replace(" ", "_")
      
      
      // Prepare JSON payload
      const profilePayload: any = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        username: user?.name,
        email: user?.email,
        mobileNumber: profileData.phone,
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender,
        city: profileData.city,
        address: profileData.address,
        userRole: userRole,
        socialLinks: [
          { platform: "linkedIn", url: profileData.linkedIn },
          { platform: "github", url: profileData.github },
          { platform: "portfolio", url: profileData.portfolio },
          { platform: "twitter", url: profileData.twitter }
        ].filter(link => link.url.trim() !== "") // Remove empty URLs
      };
      console.log(JSON.stringify(profilePayload));
      
      
      // Add role-specific data
      if (userType === 'Project Member') {
        profilePayload.institution = profileData.institution;
        profilePayload.areaOfInterest = profileData.areaOfInterest;
        profilePayload.yearsOfStudy = profileData.yearsOfStudy;
        profilePayload.major = profileData.major;
        profilePayload.currentPosition = profileData.currentPosition;
      } else if (userType === 'Mentor') {
        profilePayload.qualification = profileData.qualification;
        profilePayload.expertise = profileData.expertise; // Already an array, no need to stringify
        profilePayload.experience = profileData.experience;
        profilePayload.bio = profileData.bio;
        profilePayload.availability = profileData.availability;
        profilePayload.termsAccepted = profileData.termsAccepted;
        
        if (profileData.resume) {
          console.warn('Resume file will not be included in JSON payload');
        }
        if (profileData.certifications.length > 0) {
          console.warn('Certification files will not be included in JSON payload');
        }
      }

      console.log('Sending JSON payload:', profilePayload);

      const response = await fetch(`http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profilePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create profile');
      }

      const responseData = await response.json();
      console.log('Profile created successfully:', responseData);
      
      setIsSuccess(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ 
        submit: error instanceof Error ? error.message : 'An error occurred while updating your profile' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExpertiseToggle = (expertise: string) => {
    setProfileData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...prev.expertise, expertise]
    }));
  };

  // Calculate total steps and progress
  const totalSteps = userType === 'Project Member' ? 1 : 2;
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

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
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-[650px] w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Complete!</h2>
          <p className="text-gray-600 mb-6">
            Welcome! Your {userType.toLowerCase()} profile has been created successfully.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary hover:text-black transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-[45%] w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-white p-6 text-gray-800 text-center">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            </div>
            <h1 className="text-2xl font-bold mb-2">
              Complete Your {userType} Profile
            </h1>
            <p className="text-gray-600">
              {currentStep === 0 
                ? 'Add your personal details to complete registration'
                : 'Add your qualifications and experience'
              }
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{progressPercentage}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Step 1: Personal Details */}
          {currentStep === 0 && (
            <form onSubmit={userType === 'Project Member' ? handleFinalSubmit : (e) => { e.preventDefault(); handleNext(); }} className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h3>
                
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors ${
                        errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.dateOfBirth}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender (Optional)
                    </label>
                    <select
                      value={profileData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors"
                    >
                      <option value="">Select gender</option>
                      {genderOptions.map(gender => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors ${
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

                {/* Academic/Professional Information */}
                {userType === 'Project Member' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Institution / University *
                      </label>
                      <input
                        type="text"
                        value={profileData.institution}
                        onChange={(e) => handleInputChange('institution', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors ${
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Year of Study *
                        </label>
                        <select
                          value={profileData.yearsOfStudy}
                          onChange={(e) => handleInputChange('yearsOfStudy', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors ${
                            errors.yearsOfStudy ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select year of study</option>
                          {yearsOfStudyOptions.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        {errors.yearsOfStudy && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.yearsOfStudy}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Major/Field of Study *
                        </label>
                        <input
                          type="text"
                          value={profileData.major}
                          onChange={(e) => handleInputChange('major', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors ${
                            errors.major ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="e.g. Computer Science"
                        />
                        {errors.major && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.major}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Area of Interest *
                      </label>
                      <select
                        value={profileData.areaOfInterest}
                        onChange={(e) => handleInputChange('areaOfInterest', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors ${
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
                        Current Position (Optional)
                      </label>
                      <input
                        type="text"
                        value={profileData.currentPosition}
                        onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors"
                        placeholder="e.g. Student, Intern, Research Assistant"
                      />
                    </div>
                  </>
                )}

                {/* Social Links */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">Social & Professional Links (Optional)</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        value={profileData.linkedIn}
                        onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GitHub Profile
                        </label>
                        <input
                          type="url"
                          value={profileData.github}
                          onChange={(e) => handleInputChange('github', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors"
                          placeholder="https://github.com/yourusername"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Portfolio Website
                        </label>
                        <input
                          type="url"
                          value={profileData.portfolio}
                          onChange={(e) => handleInputChange('portfolio', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors"
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter Profile
                      </label>
                      <input
                        type="url"
                        value={profileData.twitter}
                        onChange={(e) => handleInputChange('twitter', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors"
                        placeholder="https://twitter.com/yourusername"
                      />
                    </div>
                  </div>
                </div>

                {/* Error message for submission */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-700 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.submit}
                    </p>
                  </div>
                )}

                {/* Updated button section for Step 1 */}
                <div className="flex justify-end pt-6">
                  {userType === 'Project Member' ? (
                    <div className='flex gap-3'>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary hover:text-black disabled:bg-blue-400 transition-colors flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                            Updating Profile...
                          </>
                        ) : (
                          'Complete Registration'
                        )}
                      </button>
                      <button
                          type="button"
                          onClick={() => router.push('/project-member/dashboard')}
                          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                        >
                          Skip for now
                        </button>
                      </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => router.push('/domain-expert/dashboard')}
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                      >
                        Skip for now
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary hover:text-black disabled:bg-blue-400 transition-colors flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                            Next...
                          </>
                        ) : (
                          'Next'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          )}

          {/* Step 2: Mentor Qualifications */}
          {currentStep === 1 && userType === 'Mentor' && (
            <form onSubmit={handleFinalSubmit} className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Qualifications</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Highest Qualification *
                  </label>
                  <select
                    value={profileData.qualification}
                    onChange={(e) => handleInputChange('qualification', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors ${
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

                {/* New Qualification Documents Upload Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualification Documents *
                  </label>
                  <p className="text-xs text-gray-600 mb-3">
                    Upload documents to verify your qualifications (degrees, certificates, licenses, etc.). These will be reviewed by our moderators.
                  </p>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      {profileData.certifications.length > 0 
                        ? `${profileData.certifications.length} document(s) selected` 
                        : 'Click to upload or drag and drop qualification documents'
                      }
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG (Max 10MB each, up to 5 files)</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      multiple
                      onChange={(e) => e.target.files && handleFileUpload('certifications', e.target.files)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  
                  {/* Display selected files */}
                  {profileData.certifications.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Selected Documents:</p>
                      {profileData.certifications.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <Upload className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newFiles = profileData.certifications.filter((_, i) => i !== index);
                              setProfileData(prev => ({ ...prev, certifications: newFiles }));
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {errors.certifications && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.certifications}
                    </p>
                  )}
                  
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-800">
                        <p className="font-medium mb-1">Document Verification Process:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-blue-700">
                          <li>Your documents will be reviewed by our moderators</li>
                          <li>Verification typically takes 2-3 business days</li>
                          <li>You'll be notified via email once verification is complete</li>
                          <li>Accepted formats: Academic transcripts, diplomas, certificates, professional licenses</li>
                        </ul>
                      </div>
                    </div>
                  </div>
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
                          checked={profileData.expertise.includes(area)}
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
                    value={profileData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors ${
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
                      {profileData.resume ? profileData.resume.name : 'Click to upload or drag and drop'}
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
                    Professional Bio *
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors resize-none ${
                      errors.bio ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tell us about your professional background, achievements, and what makes you a great mentor..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {profileData.bio.length}/500 characters
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
                    value={profileData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors ${
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

                <div className="border-t pt-6">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={profileData.termsAccepted}
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

                {/* Error message for submission */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-700 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.submit}
                    </p>
                  </div>
                )}

                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => router.push('/domain-expert/dashboard')}
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                    >
                      Skip for now
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary hover:text-black disabled:bg-blue-400 transition-colors flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          Updating Profile...
                        </>
                      ) : (
                        'Complete Registration'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;