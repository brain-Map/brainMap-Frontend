"use client";

import { useState, useEffect } from "react";
import { supabase } from '@/lib/superbaseClient';
import api from '@/utils/api';
import Swal from 'sweetalert2';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Shield,
  GraduationCap,
  Users,
  UserRoundPlus,
} from "lucide-react";

interface AccountData {
  userName: string;
  email: string;
  userRole: string;
  password: string;
  confirmPassword: string;
}
export default function Page() {
  // Form data state
  const [accountData, setAccountData] = useState<AccountData>({
    userName: '',
    email: '',
    userRole: 'ADMIN',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | '' }>({
    message: '',
    type: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof AccountData, value: string) => {
    setAccountData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleCancel = () => {
    // simple reset
    setAccountData({ userName: '', email: '', userRole: 'ADMIN', password: '', confirmPassword: '' });
    setErrors({});
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!accountData.userName.trim()) e.userName = 'User name is required';
    if (!accountData.email.trim()) e.email = 'Email is required';
    // simple email regex
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountData.email)) e.email = 'Invalid email address';
    if (!accountData.password) e.password = 'Password is required';
    if (accountData.password !== accountData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Use SweetAlert2 for confirmation
    const result = await Swal.fire({
      title: 'Confirm Submission',
      text: 'Are you sure you want to add this Administrator?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, add adminstrator',
      cancelButtonText: 'Cancel'
    });
    
    if (!result.isConfirmed) return;
    setLoading(true);
    try {

      // 2) POST to backend with user info and supabase userId
      const payload = {
        username: accountData.userName,
        email: accountData.email,
        userRole: accountData.userRole,
        password: accountData.password
      };

      await api.post('/api/v1/admin/createUser', payload);

      // success - reset form
      setAccountData({ userName: '', email: '', userRole: 'ADMIN', password: '', confirmPassword: '' });
      setErrors({});
      setIsSubmitted(true);
      
      // Show success alert using SweetAlert2
      await Swal.fire({
        title: 'Success!',
        text: 'Administrator added successfully!',
        icon: 'success',
        confirmButtonColor: '#3085d6'
      });
    } catch (err: any) {
      console.error(err);
      setErrors({ general: err?.message || 'An error occurred' });
      
      // Show error alert using SweetAlert2
      await Swal.fire({
        title: 'Error!',
        text: err?.message || 'Error adding administrator. Please try again.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSubmitted) {
      // Reset form or perform any other actions after submission
    }
  }, [isSubmitted]);

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
                Add New Adminstrator
              </h1>
              <p className="text-gray-600">
                Create a new Administrator account for the platform.
              </p>
            </div>
          </div>
        </div>

        {alert.message && (
          <div className={`p-4 mb-4 rounded-lg ${alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} role="alert">
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
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
                  <Label htmlFor="userName">User Name *</Label>
                  <Input
                    id="userName"
                    placeholder="Enter user name"
                    value={accountData.userName}
                    onChange={(e) => handleInputChange("userName", e.target.value)}
                    className={
                      errors.userName
                        ? "border-red-500"
                        : "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    }
                  />
                  {errors.userName && (
                    <p className="text-red-500 text-sm">{errors.userName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={accountData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={
                      errors.email
                        ? "border-red-500"
                        : "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    }
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={accountData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={
                      errors.password
                        ? "border-red-500"
                        : "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    }
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={accountData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={
                      errors.confirmPassword
                        ? "border-red-500"
                        : "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    }
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="hover:cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-secondary text-white hover:cursor-pointer"
            >
              Create User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
