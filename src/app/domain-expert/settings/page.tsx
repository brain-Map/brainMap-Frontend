"use client";

import React, { useState } from "react";
import MentorEditForm from "../../../components/domainExpert/MentorEditForm";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DomainExpertSettings() {
  const [activeTab, setActiveTab] = useState<"edit" | "delete">("edit");
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete your profile? This action is irreversible."
    );
    if (!confirmed) return;
    try {
      setDeleting(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const userId = typeof window !== 'undefined' && localStorage.getItem('userId');
      if (!userId) throw new Error('Missing user id');

      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/domain-experts/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Profile deleted successfully.');
      router.push('/');
    } catch (err: any) {
      console.error('Failed to delete profile', err);
      alert('Failed to delete profile: ' + (err?.response?.data?.message || err?.message));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-16">
  <div className="max-w-[1300px] mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            {/* Left: vertical tabs in their own card */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-primary mb-4">Settings</h2>
                <div className="flex md:flex-col gap-2">
                  <button
                    aria-selected={activeTab === 'edit'}
                    className={`text-left px-4 py-2 rounded-lg w-full ${activeTab === 'edit' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setActiveTab('edit')}
                  >
                    Edit Profile
                  </button>

                  <button
                    aria-selected={activeTab === 'delete'}
                    className={`text-left px-4 py-2 rounded-lg w-full ${activeTab === 'delete' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setActiveTab('delete')}
                  >
                    Delete Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Right: content in a separate card */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                {activeTab === 'edit' && (
                  <div>
                    <MentorEditForm />
                  </div>
                )}

                {activeTab === 'delete' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-700">
                      Deleting your profile will remove your domain-expert account, profile information and all associated data. This action cannot be undone.
                    </p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                      >
                        {deleting ? 'Deleting...' : 'Yes, delete my profile'}
                      </button>
                      <button
                        onClick={() => setActiveTab('edit')}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
