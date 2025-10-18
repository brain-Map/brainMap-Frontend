"use client";

import React, { useState } from "react";
import api from "@/utils/api";
import Swal from "sweetalert2";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

const INQUIRY_TYPES = [
  "ISSUE",
  "POST",
  "COMMENT",
  "REVIEW",
  "PROJECT",
  "ACCOUNT",
  "PAYMENT",
  "SUPPORT",
  "OTHER",
] as const;

export default function CreateInquiryPage() {
  const { user, loading } = useAuth();
  const [inquiryType, setInquiryType] = useState<(typeof INQUIRY_TYPES)[number] | "">("");
  const [title, setTitle] = useState("");
  const [inquiryContent, setInquiryContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = !!user?.id && !!inquiryType && !!title.trim() && !!inquiryContent.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: 'Confirm Submission',
      text: 'Are you sure you want to submit this inquiry?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });
    if (!result.isConfirmed) return;
    if (!canSubmit) {
      if (!user?.id) {
        await Swal.fire({
          title: "Sign in required",
          text: "Please sign in to submit an inquiry.",
          icon: "info",
          confirmButtonColor: "#3085d6",
        });
        return;
      }
      await Swal.fire({
        title: "Missing fields",
        text: "Please fill in all required fields before submitting.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        userId: user!.id,
        inquiryType: inquiryType as string, // already uppercase
        title: title.trim(),
        inquiryContent: inquiryContent.trim(),
      };

      await api.post("/api/v1/inquiries/create", payload);

      await Swal.fire({
        title: "Inquiry Created",
        text: "Your inquiry has been submitted successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      // Clear form after success
      setInquiryType("");
      setTitle("");
      setInquiryContent("");
    } catch (err: any) {
      console.error("Failed to create inquiry:", err);
      await Swal.fire({
        title: "Error",
        text: err?.response?.data?.message || "Failed to create inquiry.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Inquiry</h1>
          <p className="text-gray-600 mt-1">Submit a new inquiry for review.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-sm text-gray-600">
              Submitting as: <span className="font-medium text-gray-900">{user?.email || user?.id || "Guest"}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inquiry Type
              </label>
              <Select value={inquiryType} onValueChange={(v) => setInquiryType(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {INQUIRY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <Input
                placeholder="Enter a short title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inquiry Content
              </label>
              <textarea
                value={inquiryContent}
                onChange={(e) => setInquiryContent(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                placeholder="Describe your inquiry..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setInquiryType("");
                  setTitle("");
                  setInquiryContent("");
                }}
                disabled={submitting}
              >
                Clear
              </Button>
              <Button type="submit" disabled={!canSubmit || submitting || loading}>
                {submitting ? "Submitting..." : !user?.id ? "Sign in to submit" : "Submit Inquiry"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
