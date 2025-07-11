'use client';

import React, { useState } from 'react';
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
  Moon,
  Sun,
  Monitor,
  Clock,
  Volume2,
  VolumeX,
  Plus
} from 'lucide-react';

interface SettingsProps {}

const SettingsPage: React.FC<SettingsProps> = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isUploading, setIsUploading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: {
      userReports: true,
      expertApplications: true,
      systemAlerts: true,
      userViolations: true,
      withdrawalRequests: true
    },
    push: {
      urgentReports: true,
      newExpertApplications: true,
      systemIssues: true,
      userAppeals: false
    },
    inApp: {
      newReports: true,
      userActivity: true,
      expertRequests: true,
      systemNotifications: true
    }
  });

  const [profileData, setProfileData] = useState({
    fullName: 'Sarah Mitchell',
    username: 'sarah_moderator',
    email: 'sarah.mitchell@brainmap.admin',
    phone: '+1 (555) 987-6543',
    location: 'New York, NY',
    role: 'Senior Moderator',
    avatar: '/image/user.jpg'
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'moderators',
    showEmail: false,
    showPhone: false,
    showModerationStats: true,
    showOnlineStatus: true,
    allowContactFromUsers: true,
    showModerationHistory: false
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

  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'account', label: 'Account', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Eye }
  ];

  const SettingsTab = ({ id, label, icon: Icon, isActive, onClick }: any) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-primary text-white shadow-lg'
          : 'text-gray-600 hover:bg-value3 hover:text-primary'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account, preferences, and privacy settings</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <nav className="space-y-2">
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
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                
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

                {/* Role Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <div className="relative">
                      <Users size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.role}
                        onChange={(e) => handleProfileUpdate('role', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => handleProfileUpdate('location', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
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
                            {key === 'userReports' && 'Get notified about new user reports and violations'}
                            {key === 'expertApplications' && 'New expert applications requiring review'}
                            {key === 'systemAlerts' && 'Important system alerts and security notifications'}
                            {key === 'userViolations' && 'Notifications about policy violations and infractions'}
                            {key === 'withdrawalRequests' && 'Expert withdrawal and account deactivation requests'}
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
                            {key === 'urgentReports' && 'High-priority reports requiring immediate attention'}
                            {key === 'newExpertApplications' && 'New expert applications submitted for review'}
                            {key === 'systemIssues' && 'Critical system issues and platform emergencies'}
                            {key === 'userAppeals' && 'Appeals from users regarding moderation decisions'}
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
                            {key === 'newReports' && 'New user reports and moderation requests'}
                            {key === 'userActivity' && 'Suspicious user activity and behavior patterns'}
                            {key === 'expertRequests' && 'Expert verification and approval requests'}
                            {key === 'systemNotifications' && 'Platform updates and administrative notices'}
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
                          <p className="text-sm text-gray-500">Your profile is visible to all platform users</p>
                        </div>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="moderators"
                          checked={privacy.profileVisibility === 'moderators'}
                          onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Moderators Only</p>
                          <p className="text-sm text-gray-500">Only other moderators and admins can view your profile</p>
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
                        { key: 'showEmail', label: 'Show Email Address', description: 'Allow other moderators and admins to see your email address' },
                        { key: 'showPhone', label: 'Show Phone Number', description: 'Allow other moderators and admins to see your phone number' },
                        { key: 'showModerationStats', label: 'Show Moderation Statistics', description: 'Display your moderation activity and performance metrics' },
                        { key: 'showModerationHistory', label: 'Show Moderation History', description: 'Allow viewing of your past moderation decisions and actions' },
                        { key: 'allowContactFromUsers', label: 'Allow Contact from Users', description: 'Let platform users contact you directly for moderation issues' },
                        { key: 'showOnlineStatus', label: 'Show Online Status', description: 'Display when you are online and available for moderation' }
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
                          <p className="text-sm text-gray-500">Export your moderation data including decisions, reports handled, and account settings</p>
                        </div>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary hover:text-black transition-colors">
                          Export Data
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium text-red-900">Delete Account</p>
                          <p className="text-sm text-red-600">Permanently delete your account and all associated data</p>
                        </div>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          Delete Account
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

                  {/* Login Activity */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Login Activity</h3>
                    <div className="space-y-3">
                      {[
                        { device: 'MacBook Pro', location: 'San Francisco, CA', time: '2 hours ago', current: true },
                        { device: 'iPhone 13', location: 'San Francisco, CA', time: '1 day ago', current: false },
                        { device: 'Chrome Browser', location: 'San Francisco, CA', time: '3 days ago', current: false }
                      ].map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="font-medium text-gray-900">{session.device}</p>
                              <p className="text-sm text-gray-500">{session.location} • {session.time}</p>
                            </div>
                          </div>
                          {session.current && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Current</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connected Services */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Services</h3>
                    <div className="space-y-3">
                      {[
                        { service: 'Google Drive', status: 'Connected', color: 'green' },
                        { service: 'Dropbox', status: 'Not Connected', color: 'gray' },
                        { service: 'OneDrive', status: 'Connected', color: 'green' },
                        { service: 'GitHub', status: 'Not Connected', color: 'gray' }
                      ].map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${service.color === 'green' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className="font-medium text-gray-900">{service.service}</span>
                          </div>
                          <button className={`px-4 py-2 rounded-lg transition-colors ${
                            service.status === 'Connected' 
                              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                              : 'bg-primary text-white hover:bg-secondary hover:text-black'
                          }`}>
                            {service.status === 'Connected' ? 'Disconnect' : 'Connect'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Appearance Settings</h2>
                
                <div className="space-y-8">
                  {/* Theme */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 'light', label: 'Light', icon: Sun, description: 'Clean and bright interface' },
                        { id: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
                        { id: 'system', label: 'System', icon: Monitor, description: 'Match your device settings' }
                      ].map((theme) => (
                        <label key={theme.id} className="relative cursor-pointer">
                          <input
                            type="radio"
                            name="theme"
                            value={theme.id}
                            checked={theme.id === 'light'}
                            className="sr-only"
                          />
                          <div className={`p-4 border-2 rounded-lg transition-all ${
                            theme.id === 'light' 
                              ? 'border-primary bg-primary/5' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className="flex items-center space-x-3 mb-2">
                              <theme.icon size={20} className="text-gray-600" />
                              <span className="font-medium text-gray-900">{theme.label}</span>
                            </div>
                            <p className="text-sm text-gray-500">{theme.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Timezone */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Timezone</h3>
                    <select className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="pst">Pacific Standard Time</option>
                      <option value="mst">Mountain Standard Time</option>
                      <option value="cst">Central Standard Time</option>
                      <option value="est">Eastern Standard Time</option>
                      <option value="utc">UTC</option>
                    </select>
                  </div>

                  {/* Accessibility */}
                  {/* <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Accessibility</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'largeText', label: 'Large Text', description: 'Increase font size for better readability' },
                        { key: 'highContrast', label: 'High Contrast', description: 'Increase color contrast for better visibility' },
                        { key: 'reduceMotion', label: 'Reduce Motion', description: 'Minimize animations and transitions' },
                        { key: 'screenReader', label: 'Screen Reader Support', description: 'Optimize for screen reader compatibility' }
                      ].map(({ key, label, description }) => (
                        <div key={key} className="flex items-center justify-between py-2">
                          <div>
                            <p className="font-medium text-gray-900">{label}</p>
                            <p className="text-sm text-gray-500">{description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only"
                            />
                            <div className="w-11 h-6 rounded-full bg-gray-200 relative transition-colors">
                              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform"></div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div> */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
