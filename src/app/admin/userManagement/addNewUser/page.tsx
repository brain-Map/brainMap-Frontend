"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Lock, Shield, GraduationCap, Briefcase, Users, Clock, BookOpen, Heart, UserRoundPlus } from "lucide-react";

type UserRole = "domain-expert" | "moderator" | "member" | "";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  
  // Domain Expert fields
  education: string;
  qualifications: string;
  workExperience: string;
  
  // Moderator fields
  areasOfResponsibility: string[];
  assignedCategories: string[];
  availabilitySchedule: string;
  
  // Member fields
  memberEducation: string;
  interests: string[];
}

export default function AddNewUser() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    education: "",
    qualifications: "",
    workExperience: "",
    areasOfResponsibility: [],
    assignedCategories: [],
    availabilitySchedule: "",
    memberEducation: "",
    interests: []
  });

  const [newResponsibility, setNewResponsibility] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleArrayAdd = (field: "areasOfResponsibility" | "assignedCategories" | "interests", value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      
      // Clear the input fields
      if (field === "areasOfResponsibility") setNewResponsibility("");
      if (field === "assignedCategories") setNewCategory("");
      if (field === "interests") setNewInterest("");
    }
  };

  const handleArrayRemove = (field: "areasOfResponsibility" | "assignedCategories" | "interests", index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (!formData.role) newErrors.role = "Role selection is required";
    
    setErrors(newErrors as Partial<Record<keyof FormData, string>>);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Handle form submission here
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      education: "",
      qualifications: "",
      workExperience: "",
      areasOfResponsibility: [],
      assignedCategories: [],
      availabilitySchedule: "",
      memberEducation: "",
      interests: []
    });
    setErrors({});
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case "domain-expert":
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Domain Expert Information
              </CardTitle>
              <CardDescription>
                Additional information required for domain expert role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="education">Education Background</Label>
                <Textarea
                  id="education"
                  placeholder="Enter educational qualifications, degrees, and institutions..."
                  value={formData.education}
                  onChange={(e) => handleInputChange("education", e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="qualifications">Professional Qualifications</Label>
                <Textarea
                  id="qualifications"
                  placeholder="Enter certifications, licenses, and professional qualifications..."
                  value={formData.qualifications}
                  onChange={(e) => handleInputChange("qualifications", e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workExperience">Work Experience</Label>
                <Textarea
                  id="workExperience"
                  placeholder="Enter relevant work experience, positions held, and achievements..."
                  value={formData.workExperience}
                  onChange={(e) => handleInputChange("workExperience", e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        );

      case "moderator":
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Moderator Information
              </CardTitle>
              <CardDescription>
                Configuration for moderator responsibilities and schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="responsibilities">Areas of Responsibility</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add area of responsibility..."
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleArrayAdd("areasOfResponsibility", newResponsibility)}
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleArrayAdd("areasOfResponsibility", newResponsibility)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.areasOfResponsibility.map((responsibility, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer">
                      {responsibility}
                      <button
                        onClick={() => handleArrayRemove("areasOfResponsibility", index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categories">Assigned Categories</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add assigned category..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleArrayAdd("assignedCategories", newCategory)}
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleArrayAdd("assignedCategories", newCategory)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.assignedCategories.map((category, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer">
                      {category}
                      <button
                        onClick={() => handleArrayRemove("assignedCategories", index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Availability Schedule</Label>
                <Textarea
                  id="availability"
                  placeholder="Enter preferred working hours, time zones, and availability schedule..."
                  value={formData.availabilitySchedule}
                  onChange={(e) => handleInputChange("availabilitySchedule", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        );

      case "member":
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Member Information
              </CardTitle>
              <CardDescription>
                Additional information for platform member
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="memberEducation">Education Background</Label>
                <Textarea
                  id="memberEducation"
                  placeholder="Enter educational background and current study level..."
                  value={formData.memberEducation}
                  onChange={(e) => handleInputChange("memberEducation", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Areas of Interest</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add area of interest..."
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleArrayAdd("interests", newInterest)}
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleArrayAdd("interests", newInterest)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer">
                      {interest}
                      <button
                        onClick={() => handleArrayRemove("interests", index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserRoundPlus className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1 grid gap-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  Add New User
                </h1>
                <p className="text-gray-600">
                  Create a new user account for the platform.
                </p>
              </div>
            </div>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Enter the basic details for the new user account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">User Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value as UserRole)}>
                  <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select user role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="domain-expert">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Domain Expert
                      </div>
                    </SelectItem>
                    <SelectItem value="moderator">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Moderator
                      </div>
                    </SelectItem>
                    <SelectItem value="member">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Member
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Role-specific fields */}
          {renderRoleSpecificFields()}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
