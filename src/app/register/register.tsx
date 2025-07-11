'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserCheck, ArrowRight } from 'lucide-react';


const RoleSelectionPage = () => {
  const router = useRouter();

  const handleRoleSelection = (role: string) => {
    // Navigate to registration page with role parameter
    router.push(`/register?role=${encodeURIComponent(role)}`);
    
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Our Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your role to get started. Whether you're looking to learn or teach, 
            we have the perfect path for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Project Member Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-primary p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Project Member
              </h2>
              <p className="text-blue-100 text-center">
                Join projects, learn from mentors, and build your skills
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-600">Access to learning projects</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-600">Connect with experienced mentors</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-600">Build your portfolio</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-600">Gain practical experience</span>
                </div>
              </div>
              
              <button
                onClick={() => handleRoleSelection('Project Member')}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-secondary hover:text-black transition-colors flex items-center justify-center gap-2 group"
              >
                Get Started as Project Member
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Mentor Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-green-600 p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Mentor
              </h2>
              <p className="text-green-100 text-center">
                Share your expertise, guide others, and make an impact
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Guide aspiring professionals</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Share your knowledge and skills</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Build your professional network</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Flexible mentoring schedule</span>
                </div>
              </div>
              
              <button
                onClick={() => handleRoleSelection('Mentor')}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 group"
              >
                Get Started as Mentor
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );



  
};

export default RoleSelectionPage;