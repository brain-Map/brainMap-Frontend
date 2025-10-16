
"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from '@/contexts/AuthContext'; 


interface Package {
  serviceId: string
  title: string
  description: string
  price: number
  duration: string
  features: string[]
  subjectStream: string
  status: string
  createdAt: string
  lastUpdated: string
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { user } = useAuth();

  const mentorId = user?.id

  useEffect(() => {
    if (!mentorId) return;
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    axios.get(`http://localhost:8080/api/v1/service-listings/mentor/${mentorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setPackages(Array.isArray(res.data) ? res.data : [])
        console.log(res.data);
        
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to fetch packages.");
        setLoading(false);
      });
  }, [mentorId]);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`http://localhost:8080/api/v1/service-listings/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPackages(pkgs => pkgs.filter(pkg => pkg.serviceId !== deleteId));
    } catch (err) {
      alert("Failed to delete package.");
    }
    setShowDeleteModal(false);
    setDeleteId(null);
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setDeleteId(null)
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Service Packages</h1>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading packages...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-8 text-gray-400">No packages found.</td>
                  </tr>
                ) : (
                  packages.map(pkg => (
                    <tr key={pkg.serviceId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <a href={`/services/${pkg.serviceId}`} className="text-blue-600 hover:underline font-medium">
                          {pkg.title}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => alert('View not implemented')}
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                          >View</button>
                          <button
                            onClick={() => alert('Edit not implemented')}
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                          >Edit</button>
                          <button
                            onClick={() => handleDeleteClick(pkg.serviceId)}
                            className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
                          >Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this package?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >Cancel</button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
