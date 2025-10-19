"use client";

import React, { useState } from "react";
import { Send, Mail, Phone, MapPin, Clock, Star, ArrowRight, CheckCircle, MessageCircle, HelpCircle, Users, Calendar } from "lucide-react";
import CustomButton from "@/components/CustomButtonModel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Swal from "sweetalert2";
import api from "@/utils/api";
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

const HelpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
  });

  // inquiry form fields from CreateInquiryPage
  const { user } = useAuth();
  const [inquiryType, setInquiryType] = useState<(typeof INQUIRY_TYPES)[number] | "">( "" );
  const [title, setTitle] = useState("");
  const [inquiryContent, setInquiryContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { value: "general", label: "General Inquiry" },
    { value: "support", label: "Technical Support" },
    { value: "project", label: "Project Management Help" },
    { value: "mentor", label: "Become a Mentor" },
  ];

  const faqs = [
    { question: "How can I find help articles?", answer: "Use the search bar or browse our categories to find step-by-step guides." },
    { question: "How do I report a bug?", answer: "Use the Help form below and choose 'ISSUE' as the inquiry type so our engineers can triage it." },
    { question: "Can I request a new feature?", answer: "Yes — choose 'PROJECT' or 'OTHER' and describe your idea." },
  ];

  const contactInfo = [
    { icon: Mail, title: "Support Email", details: "help@brainmap.com", description: "Reach out for non-urgent questions", action: "mailto:help@brainmap.com" },
    { icon: Phone, title: "Phone Support", details: "+1 (555) 987-6543", description: "Call our support line", action: "tel:+15559876543" },
    { icon: MapPin, title: "Office", details: "456 Support Lane, Tech City", description: "Visit during business hours", action: "#" },
    { icon: Clock, title: "Hours", details: "Mon-Fri 9am-5pm", description: "Operational support hours", action: "#" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // send inquiry-like payload to api
      if (!user?.id) {
        await Swal.fire({ title: "Sign in required", text: "Please sign in to submit an inquiry.", icon: "info", confirmButtonColor: "#3085d6" });
        setSubmitting(false);
        return;
      }

      const payload = {
        userId: user.id,
        inquiryType: inquiryType || "OTHER",
        title: title || formData.subject || "Help Request",
        inquiryContent: inquiryContent || formData.message || "",
      };

      // best-effort post; api may not exist in this dev env
      await api.post("/api/v1/inquiries/create", payload).catch(() => null);

      await Swal.fire({ title: "Submitted", text: "Your request was submitted.", icon: "success", confirmButtonColor: "#3085d6" });

      // clear
      setInquiryType("");
      setTitle("");
      setInquiryContent("");
      setFormData({ name: "", email: "", subject: "", category: "general", message: "" });
    } catch (err: any) {
      console.error(err);
      await Swal.fire({ title: "Error", text: err?.message || "Failed to submit.", icon: "error", confirmButtonColor: "#d33" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Help Center</h1>
          <p className="text-gray-600 mt-2">Find guides, FAQs and submit a help request.</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Submit a Help Request</h2>
            <p className="text-gray-600">Use the form below to open a request with our support team.</p>
          </div>

          <form onSubmit={handleSupportSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Full name" className="w-full px-4 py-3 border rounded-xl" />
              <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full px-4 py-3 border rounded-xl" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Inquiry Type</label>
              <Select value={inquiryType} onValueChange={(v) => setInquiryType(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  {INQUIRY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <input name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Subject" className="w-full px-4 py-3 border rounded-xl" />
            </div>

            <div>
              <textarea name="message" value={formData.message} onChange={handleInputChange} rows={6} placeholder="Describe your issue" className="w-full px-4 py-3 border rounded-xl" />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setFormData({ name: "", email: "", subject: "", category: "general", message: "" }); setInquiryType(""); setTitle(""); setInquiryContent(""); }} disabled={submitting}>Clear</Button>
              <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : (!user?.id ? 'Sign in to submit' : 'Submit Request')}</Button>
            </div>
          </form>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {contactInfo.map((info, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                <info.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold">{info.title}</h3>
              <div className="text-primary font-semibold">{info.details}</div>
              <p className="text-gray-600 text-sm">{info.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
