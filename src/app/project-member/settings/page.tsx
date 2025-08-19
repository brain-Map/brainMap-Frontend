'use client';

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { 
  User, 
  Bell, 
  Lock, 
  Shield, 
  Eye,
  Globe,
  Calendar,
  MessageCircle,
  Save,
  Upload,
  Camera,
  Mail,
  Phone,
  MapPin,
  Building,
  GraduationCap,
  BookOpen,
  Users,
  Settings,
  Trash2,
  Edit3,
  CheckCircle,
  AlertCircle,
  Volume2,
  VolumeX,
  Plus,
  AlertTriangle
} from 'lucide-react';

interface SettingsProps {}

const SettingsPage: React.FC<SettingsProps> = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingInterest, setIsAddingInterest] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [notifications, setNotifications] = useState({
    email: {
      projectUpdates: true,
      expertMessages: true,
      deadlineReminders: true,
      collaborationInvites: true,
      systemUpdates: false
    },
    push: {
      instantMessages: true,
      meetingReminders: true,
      taskDeadlines: true,
      expertAvailability: false
    },
    inApp: {
      newProjects: true,
      comments: true,
      mentions: true,
      fileSharing: true
    }
  });

  const [profileData, setProfileData] = useState({
    fullName: 'Nadun Madusanka',
    username: 'nadu_nm',
    email: 'nadun.madusanka@university.edu',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    dateOfBirth: '',
    gender: '',
    bio: 'PhD student specializing in machine learning and AI ethics. Passionate about developing ethical AI systems for healthcare applications.',
    researchInterests: ['Machine Learning', 'AI Ethics', 'Healthcare AI', 'Computer Vision', 'NLP'],
    avatar: '/image/user.jpg'
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showProjects: true,
    showProgress: true,
    allowContactFromExperts: true,
    showOnlineStatus: true
  });

  const handleProfileUpdate = (field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (category: string, setting: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handlePrivacyChange = (setting: string, value: any) => {
    setPrivacy(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload process
      setTimeout(() => {
        setIsUploading(false);
        // In real app, you would upload to server and update profileData.avatar
      }, 2000);
    }
  };

  const handleSaveSettings = () => {
    // Simulate saving settings
    console.log('Saving settings...', { profileData, notifications, privacy });
    // Show success message
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !profileData.researchInterests.includes(newInterest.trim())) {
      const updatedInterests = [...profileData.researchInterests, newInterest.trim()];
      handleProfileUpdate('researchInterests', updatedInterests);
      setNewInterest('');
      setIsAddingInterest(false);
    }
  };

  const handleCancelAddInterest = () => {
    setNewInterest('');
    setIsAddingInterest(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddInterest();
    } else if (e.key === 'Escape') {
      handleCancelAddInterest();
    }
  };

  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'account', label: 'Account', icon: Settings },
    { id: 'reports', label: 'Reports', icon: AlertTriangle }
  ];

  const SettingsTab = ({ id, label, icon: Icon, isActive, onClick }: any) => (
    <button
      onClick={() => onClick(id)}
      className={cn(
        'w-full flex items-center gap-x-3 px-3 py-2 text-sm transition-colors',
        isActive
          ? 'bg-gray-100/80 text-gray-900 font-medium'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-5">
            <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your account, preferences, and privacy settings</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex bg-white min-h-[calc(100vh-5rem)]">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 border-r border-gray-200">
            <nav className="p-2 sticky top-0">
              {settingsTabs.map((tab) => (
                <SettingsTab
                  key={tab.id}
                  id={tab.id}
                  label={tab.label}
                  icon={tab.icon}
                  isActive={activeTab === tab.id}
                  onClick={setActiveTab}
                />
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-gray-50/50">
            <div className="p-8 max-w-4xl">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                </div>
                
                {/* Avatar Section */}
                <div className="mb-8">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={profileData.avatar}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Profile Picture</h3>
                      <p className="text-sm text-gray-500 mb-3">Update your profile picture</p>
                      <label className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary hover:text-black transition-colors cursor-pointer">
                        <Camera size={16} className="mr-2" />
                        Upload New Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => handleProfileUpdate('fullName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => handleProfileUpdate('username', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleProfileUpdate('dateOfBirth', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      value={profileData.gender}
                      onChange={(e) => handleProfileUpdate('gender', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileUpdate('email', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* ...existing code... */}

                {/* About Me */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">About Me</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tell us about yourself, your research interests, and academic goals..."
                  />
                </div>

                {/* Research Interests */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Research Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.researchInterests.map((interest, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {interest}
                        <button
                          onClick={() => {
                            const newInterests = profileData.researchInterests.filter((_, i) => i !== index);
                            handleProfileUpdate('researchInterests', newInterests);
                          }}
                          className="ml-2 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    
                    {/* Add Interest Input */}
                    {isAddingInterest ? (
                      <div className="inline-flex items-center gap-2">
                        <input
                          type="text"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="Enter interest..."
                          className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          autoFocus
                        />
                        <button
                          onClick={handleAddInterest}
                          disabled={!newInterest.trim()}
                          className="text-green-600 hover:text-green-700 disabled:text-gray-400"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={handleCancelAddInterest}
                          className="text-red-600 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsAddingInterest(true)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:border-primary hover:text-primary transition-colors"
                      >
                        <Plus size={14} className="mr-1" />
                        Add Interest
                      </button>
                    )}
                  </div>
                  {profileData.researchInterests.length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">No research interests added yet. Click "Add Interest" to get started.</p>
                  )}
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="inline-flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary hover:text-black transition-colors"
                  >
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                
                {/* Email Notifications */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Mail size={20} className="mr-2 text-primary" />
                    Email Notifications
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(notifications.email).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {key === 'projectUpdates' && 'Get notified about updates to your projects'}
                            {key === 'expertMessages' && 'Receive messages from domain experts'}
                            {key === 'deadlineReminders' && 'Reminders about upcoming deadlines'}
                            {key === 'collaborationInvites' && 'Invitations to collaborate on projects'}
                            {key === 'systemUpdates' && 'System maintenance and feature updates'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleNotificationChange('email', key, e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-11 h-6 rounded-full ${value ? 'bg-primary' : 'bg-gray-200'} relative transition-colors`}>
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Push Notifications */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Bell size={20} className="mr-2 text-primary" />
                    Push Notifications
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(notifications.push).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {key === 'instantMessages' && 'Real-time chat messages'}
                            {key === 'meetingReminders' && 'Upcoming meeting alerts'}
                            {key === 'taskDeadlines' && 'Task and deadline notifications'}
                            {key === 'expertAvailability' && 'When experts become available'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleNotificationChange('push', key, e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-11 h-6 rounded-full ${value ? 'bg-primary' : 'bg-gray-200'} relative transition-colors`}>
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* In-App Notifications */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Volume2 size={20} className="mr-2 text-primary" />
                    In-App Notifications
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(notifications.inApp).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {key === 'newProjects' && 'Notifications about new project invitations'}
                            {key === 'comments' && 'Comments on your work or projects'}
                            {key === 'mentions' && 'When someone mentions you'}
                            {key === 'fileSharing' && 'File sharing and collaboration updates'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleNotificationChange('inApp', key, e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-11 h-6 rounded-full ${value ? 'bg-primary' : 'bg-gray-200'} relative transition-colors`}>
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="inline-flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary hover:text-black transition-colors"
                  >
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
                
                <div className="space-y-6">
                  {/* Profile Visibility */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Visibility</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="public"
                          checked={privacy.profileVisibility === 'public'}
                          onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Public</p>
                          <p className="text-sm text-gray-500">Your profile is visible to all users</p>
                        </div>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="experts"
                          checked={privacy.profileVisibility === 'experts'}
                          onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Experts Only</p>
                          <p className="text-sm text-gray-500">Only domain experts can view your profile</p>
                        </div>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="private"
                          checked={privacy.profileVisibility === 'private'}
                          onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Private</p>
                          <p className="text-sm text-gray-500">Only you can view your profile</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Information Sharing */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Information Sharing</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'showEmail', label: 'Show Email Address', description: 'Allow others to see your email address' },
                        { key: 'showPhone', label: 'Show Phone Number', description: 'Allow others to see your phone number' },
                        { key: 'showProjects', label: 'Show Projects', description: 'Display your current and completed projects' },
                        { key: 'showProgress', label: 'Show Progress', description: 'Show your academic progress and achievements' },
                        { key: 'allowContactFromExperts', label: 'Allow Contact from Experts', description: 'Let domain experts contact you directly' },
                        { key: 'showOnlineStatus', label: 'Show Online Status', description: 'Display when you are online and available' }
                      ].map(({ key, label, description }) => (
                        <div key={key} className="flex items-center justify-between py-2">
                          <div>
                            <p className="font-medium text-gray-900">{label}</p>
                            <p className="text-sm text-gray-500">{description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacy[key as keyof typeof privacy] as boolean}
                              onChange={(e) => handlePrivacyChange(key, e.target.checked)}
                              className="sr-only"
                            />
                            <div className={`w-11 h-6 rounded-full ${privacy[key as keyof typeof privacy] ? 'bg-primary' : 'bg-gray-200'} relative transition-colors`}>
                              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${privacy[key as keyof typeof privacy] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data Export */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Download Your Data</p>
                          <p className="text-sm text-gray-500">Export all your data including projects, messages, and settings</p>
                        </div>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary hover:text-black transition-colors">
                          Export Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleSaveSettings}
                    className="inline-flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary hover:text-black transition-colors"
                  >
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                
                <div className="space-y-8">
                  {/* Change Password */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary hover:text-black transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Enable 2FA</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary hover:text-black transition-colors">
                        Enable 2FA
                      </button>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="mt-12 pt-8">
                    <h3 className="text-lg font-medium text-red-600 mb-4">Delete Account</h3>
                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-red-800 font-medium mb-2">Warning: This action is irreversible</p>
                      <p className="text-red-600 text-sm mb-4">Deleting your account will permanently remove all your data including:</p>
                      <ul className="list-disc list-inside text-red-600 text-sm mb-6 space-y-1">
                        <li>All your projects and research work</li>
                        <li>Messages and communication history</li>
                        <li>Expert connections and mentorship history</li>
                        <li>Personal settings and preferences</li>
                      </ul>
                      <div className="flex flex-col space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-red-700 mb-2">
                            Type "DELETE" to confirm
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Type DELETE in capitals"
                          />
                        </div>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto">
                          Permanently Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reports Section */}
            {activeTab === 'reports' && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Reports Management</h2>
                  <button className="inline-flex items-center px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-secondary hover:text-black transition-colors">
                    <AlertTriangle size={14} className="mr-2" />
                    Submit New Report
                  </button>
                </div>

                <div className="mt-6 space-y-6">
                  {/* Reports Made by You */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-base font-medium text-gray-900">Reports Created by You</h3>
                    </div>
                    <div className="p-4 space-y-2">
                      {[
                        { 
                          title: 'Inappropriate Content in Project Discussion',
                          reportedUser: 'john.doe',
                          date: '2025-08-15',
                          status: 'Under Review',
                          statusColor: 'yellow'
                        },
                        { 
                          title: 'Harassment in Chat',
                          reportedUser: 'user123',
                          date: '2025-08-10',
                          status: 'Resolved',
                          statusColor: 'green'
                        },
                        { 
                          title: 'Spam Messages',
                          reportedUser: 'spammer99',
                          date: '2025-08-05',
                          status: 'Closed',
                          statusColor: 'gray'
                        }
                      ].map((report, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-medium text-gray-900">{report.title}</p>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                report.statusColor === 'green' ? 'bg-green-100 text-green-800' :
                                report.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {report.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">Reported user: @{report.reportedUser}</p>
                            <p className="text-sm text-gray-500">Submitted on {report.date}</p>
                          </div>
                          <button className="ml-4 px-3 py-1.5 text-sm text-primary hover:bg-primary hover:text-white rounded-md border border-primary transition-colors">
                            View Details
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reports Against You */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-base font-medium text-gray-900">Reports Against You</h3>
                    </div>
                    <div className="p-4 space-y-2">
                      {[
                        { 
                          title: 'Code of Conduct Violation',
                          reportedBy: 'moderator',
                          date: '2025-08-12',
                          status: 'Dismissed',
                          statusColor: 'gray',
                          response: 'No violation found after review.'
                        }
                      ].map((report, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-medium text-gray-900">{report.title}</p>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              report.statusColor === 'green' ? 'bg-green-100 text-green-800' :
                              report.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {report.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">Reported by: @{report.reportedBy}</p>
                          <p className="text-sm text-gray-500">Reported on {report.date}</p>
                          {report.response && (
                            <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                              <p className="text-sm text-gray-700">{report.response}</p>
                            </div>
                          )}
                        </div>
                      ))}
                      {/* Empty State */}
                      {/* <div className="text-center py-6 bg-gray-50 rounded-md">
                        <p className="text-gray-500">No reports have been filed against you.</p>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SettingsPage;
