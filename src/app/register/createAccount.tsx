'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, AlertCircle, Check, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/superbaseClient';
import { useAuth } from '@/contexts/AuthContext';

interface AccountData {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = {
  [key: string]: string;
};

// Alert Component
const Alert = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className={`fixed top-4 right-4 z-9999 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
    type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
  }`}>
    {type === 'success' && <Check className="w-5 h-5" />}
    {type === 'error' && <AlertCircle className="w-5 h-5" />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-700">
      <X className="w-4 h-4" />
    </button>
  </div>
);

const AccountCreation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Get role from URL parameters
  useEffect(() => {
    const role = searchParams.get('role');
    console.log('Role from URL:', role);
    if (role) {
      setUserType(role);
    } else {
      // If no role is provided, redirect to role selection
      router.push('/register');
    }
  }, [searchParams, router]);

  // Form data state
  const [accountData, setAccountData] = useState<AccountData>({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: keyof AccountData, value: string) => {
    setAccountData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!accountData.userName.trim()) newErrors.userName = 'Username is required';
    if (!accountData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!accountData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!accountData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(accountData.email)) newErrors.email = 'Email is invalid';
    if (!accountData.password) newErrors.password = 'Password is required';
    if (accountData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (accountData.password !== accountData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const redirectAfterRegister = (role: string) => {
    if (role.toLowerCase() === "mentor") {
      router.push("/domain-expert/dashboard");
    } else if (role.toLowerCase() === "project member") {
      router.push("/project-member/dashboard");
    }
  };

  const handleAccountCreation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    const userName = accountData.userName;
  const firstName = accountData.firstName;
  const lastName = accountData.lastName;
    const password = accountData.password;
    const email = accountData.email;
    const role = userType;

    setIsSubmitting(true);

    // Create account using Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options:{
        data: {
          name: userName,
          first_name: firstName,
          last_name: lastName,
          user_role: role
        }
      }
    })

    if (error) {
        setIsSubmitting(false);
        setAlert({ message: error.message, type: 'error' });
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
      }

      const token = localStorage.getItem("accessToken")
      console.log("Auth: ", token || "no auth");

      const userRole = role.replace(" ", "_")
      const payload = {
          username: userName,
          firstName: firstName,
          lastName: lastName,
          email: email,
          userRole: userRole,
          userId: data.user?.id
        }
      
      // Send user data to backend API
      const backendResponse = await fetch(`http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        setIsSubmitting(false);
        setAlert({ message: errorData.error || 'Failed to create user profile', type: 'error' });
        return;
      }


    setIsSubmitting(false);

    setAlert({ message: 'Account created successfully! Please complete your profile.', type: 'success' });
    redirectAfterRegister(userType);
  };

  const handleGoogleSignup = async () => {
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      setAlert({ message: error.message, type: 'error' });
    }

    setIsSubmitting(false);

    localStorage.setItem("user_role", userType || "");

    setAlert({ message: 'Account created successfully! Please complete your profile.', type: 'success' });
    redirectAfterRegister(userType);
  }

  const handleBackToRoleSelection = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 mt-[12px]">
      {/* Alert */}
      {alert && (
        <Alert 
          message={alert.message} 
          type={alert.type} 
          onClose={() => setAlert(null)} 
        />
      )}

      <div className="max-w-[650px] w-[100%] mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-white p-6 text-gray-800 text-center">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleBackToRoleSelection}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            </div>
            <h1 className="text-2xl font-bold mb-2">
              Create Your {userType} Account
            </h1>
            <p className="text-gray-600">
              Get started by creating your account
            </p>
          </div>

          {/* Account Creation Form */}
          <form onSubmit={handleAccountCreation} className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={accountData.userName}
                  onChange={(e) => handleInputChange('userName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors ${
                    errors.userName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your Username"
                />
                {errors.userName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.userName}
                  </p>
                )}
              </div>

              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={accountData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={accountData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={accountData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={accountData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={accountData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#7091E6] transition-colors ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-secondary hover:text-black disabled:bg-blue-400 transition-colors flex items-center justify-center gap-2 mb-4"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Google Signup */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isSubmitting}
                className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isSubmitting ? 'Signing up...' : 'Sign up with Google'}
              </button>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Sign in
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountCreation;