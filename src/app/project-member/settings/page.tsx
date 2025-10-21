"use client";

import React, {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { User, Shield, Upload, Camera, Settings, Check, X } from "lucide-react";
import { convertBlobUrlToFile } from "@/lib/converToFile";
import { uploadImage } from "@/lib/storageClient";
import api from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import ProfileEditor from "./ProfileEditor";
import DeleteModal from "@/components/modals/DeleteModal";
import { useDeleteModal } from "@/hooks/useDeleteModal";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface SettingsProps {}

export interface OneUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobileNumber?: string;
  dateOfBirth?: string;
  userRole: string;
  createdAt: string;
  status: string;
  city?: string;
  gender: string;
  bio?: string;
  avatar: string;
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
      console.log("User Data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  deleteUserAccount: async (userId: string) => {
    try {
      await api.delete(`/api/v1/admin/deleteUser/${userId}`);
    } catch (error) {
      console.error("Error deleting user account:", error);
      throw error;
    }
  },
};

const SettingsPage: React.FC<SettingsProps> = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const userId = user?.id;
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [oneUserData, setOneUserData] = useState<OneUser | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [showSuccess, setShowSuccess] = useState(false);
  // Delete modal state via shared hook for consistent UX
  const { openModal: openDeleteModal, modalProps: deleteModalProps } = useDeleteModal({
    title: "Delete Account",
    confirmText: "Delete Account",
    cancelText: "Cancel",
    message:
      "This will permanently delete your account and all associated data. This action cannot be undone.",
  });

  const { updatePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordUpdateStatus, setPasswordUpdateStatus] = useState<
    "success" | "error" | null
  >(null);

  // Handles actual user deletion API call and result alerts
  const handleDeleteAccount = async () => {
    if (!userId) {
      await Swal.fire({
        icon: "error",
        title: "Cannot delete account",
        text: "No user is currently logged in.",
        confirmButtonText: "Close",
      });
      return;
    }

    try {
      await api.delete(`/api/v1/admin/deleteUser/${userId}`);

      await Swal.fire({
        icon: "success",
        title: "Account deleted",
        text:
          "Your account and all associated data have been permanently deleted. We're sorry to see you go.",
        confirmButtonText: "OK",
      });

      // Sign out locally after deletion
      await signOut();
    } catch (err: any) {
      // Extract error details comprehensively
      const status = err?.response?.status;
      const serverMessage =
        err?.response?.data?.message || err?.response?.data?.error || err?.message || "Unknown error";

      await Swal.fire({
        icon: "error",
        title: "Could not delete account",
        html: `<div class="text-left">\
                <p class="mb-2">${serverMessage}</p>\
                ${status ? `<p class="text-sm text-gray-500">Status code: ${status}</p>` : ""}\
              </div>`,
        confirmButtonText: "Close",
      });
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      setPasswordUpdateStatus("error");
      setShowPasswordModal(true);
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setPasswordUpdateStatus("error");
      setShowPasswordModal(true);
      return;
    }

    // Optional: verify current password by re-signing in
    // (Supabase requires you to be logged in already)
    const { data, error } = await updatePassword(newPassword);

    if (error) {
      console.error(error);
      setMessage(error.message || "Failed to update password");
      setPasswordUpdateStatus("error");
      setShowPasswordModal(true);
    } else {
      setMessage("Password updated successfully!");
      setPasswordUpdateStatus("success");
      setShowPasswordModal(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Auto close modal after 3 seconds on success
      setTimeout(() => {
        setShowPasswordModal(false);
      }, 3000);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const oneUserData = await settingsFunctions.getOneUserData(userId);
        setOneUserData(oneUserData);
      }
    };

    fetchUserData();
  }, [userId]);

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
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "account", label: "Account", icon: Settings },
  ];

  const SettingsTab = ({ id, label, icon: Icon, isActive, onClick }: any) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-3 w-full px-4 py-2 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-primary text-white"
          : "text-gray-600 hover:bg-value3 hover:text-primary"
      }`}
    >
      <Icon size={20} />
      <span className="font-small">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 h-[100vh] sticky top-0">
            <div className="bg-white border-r border-gray-200 p-4 h-full">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Settings
              </h2>
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
                        ) : oneUserData?.avatar ? (
                          <img
                            src={oneUserData.avatar}
                            className="w-full h-full object-cover"
                            alt="Profile Avatar"
                          />
                        ) : (
                          <User size={60} className="text-gray-400" />
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

            {/* Privacy Settings */}
            {activeTab === "privacy" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Privacy Settings
                </h2>

                <div className="space-y-6">
                  {/* Data Export */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Data Management
                    </h3>
                    <div className="space-y-4">
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
                        <button
                          onClick={() => openDeleteModal(handleDeleteAccount, [], "your account")}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
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
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <button
                        onClick={handlePasswordUpdate}
                        disabled={!newPassword || !confirmPassword}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary hover:text-black transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
                {/* Password Update Modal */}
                {showPasswordModal && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-slideUp">
                      <div className="text-center">
                        {/* Icon */}
                        <div
                          className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                            passwordUpdateStatus === "success"
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          {passwordUpdateStatus === "success" ? (
                            <Check size={32} className="text-green-600" />
                          ) : (
                            <X size={32} className="text-red-600" />
                          )}
                        </div>

                        {/* Title */}
                        <h3
                          className={`text-2xl font-bold mb-2 ${
                            passwordUpdateStatus === "success"
                              ? "text-green-900"
                              : "text-red-900"
                          }`}
                        >
                          {passwordUpdateStatus === "success"
                            ? "Success!"
                            : "Error"}
                        </h3>

                        {/* Message */}
                        <p className="text-gray-600 mb-6">{message}</p>

                        {/* Close Button */}
                        <button
                          onClick={() => setShowPasswordModal(false)}
                          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                            passwordUpdateStatus === "success"
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-red-600 hover:bg-red-700 text-white"
                          }`}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Global delete confirmation modal */}
        <DeleteModal {...deleteModalProps} />
      </div>
    </div>
  );
};

export default SettingsPage;

// Render the shared DeleteModal once at the root of this page
// Note: In Next.js App Router, placing portals at the page root ensures proper stacking
// We append this after export default due to file structure; bundler will still include it.
// Alternatively, move inside the component return near the end if preferred.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
(() => {
  // This IIFE is a no-op placeholder to keep file-level additions minimal.
})();

