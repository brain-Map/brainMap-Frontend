"use client";

import React, { ChangeEvent, useEffect, useRef, useState, useTransition } from "react";
import {
  User,
  Bell,
  Shield,
  Eye,
  Save,
  Upload,
  Camera,
  Mail,
  Settings,
  Moon,
  Sun,
  Monitor,
  Volume2,
  Plus,
  Check,
  X,
  Edit2,
} from "lucide-react";
import { convertBlobUrlToFile } from "@/lib/converToFile";
import { uploadImage } from "@/lib/storageClient";
import api from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import ProfileEditor from "./ProfileEditor"

interface SettingsProps {}

export interface OneUser{
    id: string;
    firstName:string;
    lastName:string;
    username: string;
    email: string;
    mobileNumber?: string;
    dateOfBirth?:string;
    userRole:string;
    createdAt:string;
    status:string;
    city?:string;
    gender: string;
    bio?:string;
    avatar:string;
}

const settingsFunctions = {
  updateUserProfileAvatar: async (userId: string, imageUrl: string) => {
    if (!userId || !imageUrl) return;

    try {
      await api.put("/api/v1/users/avatar", {
        userId: userId,
        avatar: imageUrl,
      });
    } catch (error) {
      console.error("Error updating user profile avatar:", error);
    }
  },


    getOneUserData: async (userId: string): Promise<OneUser> => {
    try {
      const response = await api.get(`/api/v1/users/${userId}`);
      console.log('User Data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

};





const SettingsPage: React.FC<SettingsProps> = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [oneUserData, setOneUserData] = useState<OneUser | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [showSuccess, setShowSuccess] = useState(false);
  const [notifications, setNotifications] = useState({
    email: {
      projectUpdates: true,
      expertMessages: true,
      deadlineReminders: true,
      collaborationInvites: true,
      systemUpdates: false,
    },
    push: {
      instantMessages: true,
      meetingReminders: true,
      taskDeadlines: true,
      expertAvailability: false,
    },
    inApp: {
      newProjects: true,
      comments: true,
      mentions: true,
      fileSharing: true,
    },
  });

  const [profileData, setProfileData] = useState({
    fullName: "Nadun Madusanka",
    username: "nadu_nm",
    email: "nadun.madusanka@university.edu",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    dateOfBirth: "",
    gender: "",
    bio: "PhD student specializing in machine learning and AI ethics. Passionate about developing ethical AI systems for healthcare applications.",
    researchInterests: [
      "Machine Learning",
      "AI Ethics",
      "Healthcare AI",
      "Computer Vision",
      "NLP",
    ],
    avatar: "/image/user.jpg",
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showProjects: true,
    showProgress: true,
    allowContactFromExperts: true,
    showOnlineStatus: true,
  });


   const [modalState, setModalState] = useState({
    isOpen: false,
    field: '',
    value: '',
    label: '',
    type: 'text'
  });

  


  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const oneUserData = await settingsFunctions.getOneUserData(userId);
        setOneUserData(oneUserData);
      }
    };

    fetchUserData();
  }, [userId]);




  const handleProfileUpdate = (field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (
    category: string,
    setting: string,
    value: boolean
  ) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const handlePrivacyChange = (setting: string, value: any) => {
    setPrivacy((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSaveSettings = () => {
    // Simulate saving settings
    console.log("Saving settings...", { profileData, notifications, privacy });
    // Show success message
  };


  //image upload begin

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));

      setImageUrls(newImageUrls);
    }
  };

  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState(null);

  const removeImage = () => {
    setImageUrls([]);
    setPreviewUrl(null);
    setShowSuccess(false);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleClickUploadImagesButton = async () => {
  if (imageUrls.length === 0) return;

  try {
    const urls: string[] = [];

    for (const url of imageUrls) {
      const imageFile = await convertBlobUrlToFile(url);

      const { imageUrl, error } = await uploadImage({
        file: imageFile,
        bucket: "uploads",
        folder: "avatars",
        userId: userId!, // overwrite per user
      });

      if (error) {
        console.error(error);
        return;
      }

      urls.push(imageUrl);
    }

    console.log("Uploaded avatar URLs:", urls);

    // Update only with the first (profile pic)
    settingsFunctions.updateUserProfileAvatar(userId!, urls[0]);

    // Clear after upload
    setImageUrls([]);
  } catch (err) {
    console.error("Upload failed:", err);
  }
};


  //image upload end

  const settingsTabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "account", label: "Account", icon: Settings },
    { id: "appearance", label: "Appearance", icon: Eye },
  ];

  const SettingsTab = ({ id, label, icon: Icon, isActive, onClick }: any) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-primary text-white shadow-lg"
          : "text-gray-600 hover:bg-value3 hover:text-primary"
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 h-[100vh] sticky top-0">
            <div className="bg-white border-r border-gray-200 p-4 h-full">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
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
          <div className="flex-1 p-8 max-w-7xl mx-auto">

















            {/* Profile Settings */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Profile Information
                </h2>

                {/* Avatar Section - Demo Style */}
                <div className=" flex justify-center items-center p-4">
                  <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-8 w-full max-w-md relative overflow-hidden ">
                    {/* Success Message */}
                    {showSuccess && (
                      <div className="absolute top-4 left-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 z-10">
                        <Check size={16} />
                        <span className="text-sm font-medium">
                          Profile picture updated successfully!
                        </span>
                      </div>
                    )}

                    {/* Header */}
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Update Profile Picture
                      </h1>
                      <p className="text-gray-600 text-sm">
                        Choose a new photo to represent yourself
                      </p>
                    </div>

                    {/* Profile Avatar Preview */}
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                        {imageUrls[0] ? (
                          <img
                            src={imageUrls[0]}
                            className="w-full h-full object-cover"
                            alt="Profile Avatar"
                          />
                        ) : (
                        oneUserData?.avatar ? (
                          <img
                            src={oneUserData.avatar}
                            className="w-full h-full object-cover"
                            alt="Profile Avatar"
                          />
                        ) : (
                          <User size={60} className="text-gray-400" />
                        )
                        )}
                        
                      </div>

                      {/* Edit Button Overlay */}
                      <button
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isPending}
                        className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                      >
                        <Camera size={24} className="text-white" />
                      </button>

                      {/* Corner Edit Button */}
                      <button
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isPending}
                        className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white p-3 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
                      >
                        <Camera size={16} />
                      </button>

                      {/* Remove Button */}
                      {imageUrls.length > 0 && (
                        <button
                          onClick={removeImage}
                          disabled={isPending}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white p-2 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Hidden Input */}
                    <input
                      type="file"
                      hidden
                      ref={imageInputRef}
                      onChange={handleImageChange}
                      disabled={isPending}
                      accept="image/*"
                    />

                    {/* Image Info */}
                    {imageUrls.length > 0 && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          New profile picture selected
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Click "Save Profile Picture" to apply changes
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 w-full">
                      {/* Upload/Browse Button */}
                      <button
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isPending}
                        className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-gray-400"
                      >
                        <Upload size={18} />
                        {imageUrls.length > 0
                          ? "Choose Different Photo"
                          : "Browse Photos"}
                      </button>

                      {/* Save Button */}
                      <button
                        onClick={handleClickUploadImagesButton}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 px-6 rounded-xl font-medium shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                        disabled={isPending || imageUrls.length === 0}
                      >
                        {isPending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Check size={18} />
                            Save Profile Picture
                          </>
                        )}
                      </button>
                    </div>

                    {/* Guidelines */}
                    <div className="text-center text-xs text-gray-500 space-y-1">
                      <p>Recommended: Square image, at least 400x400px</p>
                      <p>Supported formats: JPG, PNG, GIF</p>
                      <p>Maximum file size: 10MB</p>
                    </div>
                  </div>
                </div>

                <ProfileEditor />
                
              </div>
            )}









































            {/* Notifications Settings */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Notification Preferences
                </h2>

                {/* Email Notifications */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Mail size={20} className="mr-2 text-primary" />
                    Email Notifications
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(notifications.email).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between py-2"
                      >
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {key === "projectUpdates" &&
                              "Get notified about updates to your projects"}
                            {key === "expertMessages" &&
                              "Receive messages from domain experts"}
                            {key === "deadlineReminders" &&
                              "Reminders about upcoming deadlines"}
                            {key === "collaborationInvites" &&
                              "Invitations to collaborate on projects"}
                            {key === "systemUpdates" &&
                              "System maintenance and feature updates"}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) =>
                              handleNotificationChange(
                                "email",
                                key,
                                e.target.checked
                              )
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-11 h-6 rounded-full ${
                              value ? "bg-primary" : "bg-gray-200"
                            } relative transition-colors`}
                          >
                            <div
                              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                value ? "translate-x-5" : "translate-x-0"
                              }`}
                            ></div>
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
                      <div
                        key={key}
                        className="flex items-center justify-between py-2"
                      >
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {key === "instantMessages" &&
                              "Real-time chat messages"}
                            {key === "meetingReminders" &&
                              "Upcoming meeting alerts"}
                            {key === "taskDeadlines" &&
                              "Task and deadline notifications"}
                            {key === "expertAvailability" &&
                              "When experts become available"}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) =>
                              handleNotificationChange(
                                "push",
                                key,
                                e.target.checked
                              )
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-11 h-6 rounded-full ${
                              value ? "bg-primary" : "bg-gray-200"
                            } relative transition-colors`}
                          >
                            <div
                              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                value ? "translate-x-5" : "translate-x-0"
                              }`}
                            ></div>
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
                      <div
                        key={key}
                        className="flex items-center justify-between py-2"
                      >
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {key === "newProjects" &&
                              "Notifications about new project invitations"}
                            {key === "comments" &&
                              "Comments on your work or projects"}
                            {key === "mentions" && "When someone mentions you"}
                            {key === "fileSharing" &&
                              "File sharing and collaboration updates"}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) =>
                              handleNotificationChange(
                                "inApp",
                                key,
                                e.target.checked
                              )
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-11 h-6 rounded-full ${
                              value ? "bg-primary" : "bg-gray-200"
                            } relative transition-colors`}
                          >
                            <div
                              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                value ? "translate-x-5" : "translate-x-0"
                              }`}
                            ></div>
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
            {activeTab === "privacy" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Privacy Settings
                </h2>

                <div className="space-y-6">
                  {/* Profile Visibility */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Profile Visibility
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="public"
                          checked={privacy.profileVisibility === "public"}
                          onChange={(e) =>
                            handlePrivacyChange(
                              "profileVisibility",
                              e.target.value
                            )
                          }
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Public</p>
                          <p className="text-sm text-gray-500">
                            Your profile is visible to all users
                          </p>
                        </div>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="experts"
                          checked={privacy.profileVisibility === "experts"}
                          onChange={(e) =>
                            handlePrivacyChange(
                              "profileVisibility",
                              e.target.value
                            )
                          }
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            Experts Only
                          </p>
                          <p className="text-sm text-gray-500">
                            Only domain experts can view your profile
                          </p>
                        </div>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="private"
                          checked={privacy.profileVisibility === "private"}
                          onChange={(e) =>
                            handlePrivacyChange(
                              "profileVisibility",
                              e.target.value
                            )
                          }
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Private</p>
                          <p className="text-sm text-gray-500">
                            Only you can view your profile
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Information Sharing */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Information Sharing
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          key: "showEmail",
                          label: "Show Email Address",
                          description: "Allow others to see your email address",
                        },
                        {
                          key: "showPhone",
                          label: "Show Phone Number",
                          description: "Allow others to see your phone number",
                        },
                        {
                          key: "showProjects",
                          label: "Show Projects",
                          description:
                            "Display your current and completed projects",
                        },
                        {
                          key: "showProgress",
                          label: "Show Progress",
                          description:
                            "Show your academic progress and achievements",
                        },
                        {
                          key: "allowContactFromExperts",
                          label: "Allow Contact from Experts",
                          description:
                            "Let domain experts contact you directly",
                        },
                        {
                          key: "showOnlineStatus",
                          label: "Show Online Status",
                          description:
                            "Display when you are online and available",
                        },
                      ].map(({ key, label, description }) => (
                        <div
                          key={key}
                          className="flex items-center justify-between py-2"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{label}</p>
                            <p className="text-sm text-gray-500">
                              {description}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                privacy[key as keyof typeof privacy] as boolean
                              }
                              onChange={(e) =>
                                handlePrivacyChange(key, e.target.checked)
                              }
                              className="sr-only"
                            />
                            <div
                              className={`w-11 h-6 rounded-full ${
                                privacy[key as keyof typeof privacy]
                                  ? "bg-primary"
                                  : "bg-gray-200"
                              } relative transition-colors`}
                            >
                              <div
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                  privacy[key as keyof typeof privacy]
                                    ? "translate-x-5"
                                    : "translate-x-0"
                                }`}
                              ></div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data Export */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Data Management
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            Download Your Data
                          </p>
                          <p className="text-sm text-gray-500">
                            Export all your data including projects, messages,
                            and settings
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary hover:text-black transition-colors">
                          Export Data
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium text-red-900">
                            Delete Account
                          </p>
                          <p className="text-sm text-red-600">
                            Permanently delete your account and all associated
                            data
                          </p>
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
            {activeTab === "account" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Account Settings
                </h2>

                <div className="space-y-8">
                  {/* Change Password */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
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
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Two-Factor Authentication
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Enable 2FA</p>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary hover:text-black transition-colors">
                        Enable 2FA
                      </button>
                    </div>
                  </div>

                  {/* Login Activity */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Recent Login Activity
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          device: "MacBook Pro",
                          location: "San Francisco, CA",
                          time: "2 hours ago",
                          current: true,
                        },
                        {
                          device: "iPhone 13",
                          location: "San Francisco, CA",
                          time: "1 day ago",
                          current: false,
                        },
                        {
                          device: "Chrome Browser",
                          location: "San Francisco, CA",
                          time: "3 days ago",
                          current: false,
                        },
                      ].map((session, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {session.device}
                              </p>
                              <p className="text-sm text-gray-500">
                                {session.location} • {session.time}
                              </p>
                            </div>
                          </div>
                          {session.current && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connected Services */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Connected Services
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          service: "Google Drive",
                          status: "Connected",
                          color: "green",
                        },
                        {
                          service: "Dropbox",
                          status: "Not Connected",
                          color: "gray",
                        },
                        {
                          service: "OneDrive",
                          status: "Connected",
                          color: "green",
                        },
                        {
                          service: "GitHub",
                          status: "Not Connected",
                          color: "gray",
                        },
                      ].map((service, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                service.color === "green"
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <span className="font-medium text-gray-900">
                              {service.service}
                            </span>
                          </div>
                          <button
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              service.status === "Connected"
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-primary text-white hover:bg-secondary hover:text-black"
                            }`}
                          >
                            {service.status === "Connected"
                              ? "Disconnect"
                              : "Connect"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Appearance Settings
                </h2>

                <div className="space-y-8">
                  {/* Theme */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Theme
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          id: "light",
                          label: "Light",
                          icon: Sun,
                          description: "Clean and bright interface",
                        },
                        {
                          id: "dark",
                          label: "Dark",
                          icon: Moon,
                          description: "Easy on the eyes",
                        },
                        {
                          id: "system",
                          label: "System",
                          icon: Monitor,
                          description: "Match your device settings",
                        },
                      ].map((theme) => (
                        <label
                          key={theme.id}
                          className="relative cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="theme"
                            value={theme.id}
                            checked={theme.id === "light"}
                            className="sr-only"
                          />
                          <div
                            className={`p-4 border-2 rounded-lg transition-all ${
                              theme.id === "light"
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center space-x-3 mb-2">
                              <theme.icon size={20} className="text-gray-600" />
                              <span className="font-medium text-gray-900">
                                {theme.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {theme.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Timezone */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Timezone
                    </h3>
                    <select className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="pst">Pacific Standard Time</option>
                      <option value="mst">Mountain Standard Time</option>
                      <option value="cst">Central Standard Time</option>
                      <option value="est">Eastern Standard Time</option>
                      <option value="utc">UTC</option>
                    </select>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
