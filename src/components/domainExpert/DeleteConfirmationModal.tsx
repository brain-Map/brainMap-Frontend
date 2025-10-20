"use client";

import React from "react";

type Props = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
};

export default function DeleteConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  loading = false,
  title = "Confirm deletion",
  description = "Are you sure you want to delete your profile? This action is irreversible.",
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onCancel} />

      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 z-10">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, delete my profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
