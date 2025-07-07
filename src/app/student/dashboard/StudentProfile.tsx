'use client';
import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  FolderOpen, 
  TrendingUp, 
  Wrench, 
  Clock, 
  MessageSquare, 
  Shield,
  Camera,
  Award,
  FileText,
} from 'lucide-react';

interface Project {
  name: string;
  role: string;
  duration: string;
  status: 'active' | 'progress' | 'completed';
  completion: number;
}

interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'programming' | 'design' | 'other';
}

interface Activity {
  title: string;
  date: string;
  type: 'project' | 'milestone' | 'document' | 'communication';
  status?: 'submitted' | 'pending' | 'completed';
}

const StudentProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  const projects: Project[] = [
    {
      name: "E-Commerce Web App",
      role: "Full Stack Developer",
      duration: "6 months",
      status: "active",
      completion: 75
    },
    {
      name: "Mobile App UI Design",
      role: "UI/UX Designer",
      duration: "3 months",
      status: "progress",
      completion: 45
    }
  ];

  const skills: Skill[] = [
    { name: "JavaScript", level: "advanced", category: "programming" },
    { name: "React", level: "intermediate", category: "programming" },
    { name: "Python", level: "intermediate", category: "programming" },
    { name: "Figma", level: "advanced", category: "design" },
    { name: "Leadership", level: "intermediate", category: "other" },
    { name: "Communication", level: "advanced", category: "other" },
    { name: "Time Management", level: "intermediate", category: "other" },
    { name: "HTML", level: "advanced", category: "programming" },
    { name: "CSS", level: "advanced", category: "programming" },
    { name: "PHP", level: "beginner", category: "programming" },
    { name: "SQL", level: "intermediate", category: "programming" }
  ];

  const activities: Activity[] = [
    {
      title: "Submitted report for X42",
      date: "June 15, 2024",
      type: "document",
      status: "submitted"
    },
    {
      title: "Completed milestone review",
      date: "June 10, 2024",
      type: "milestone",
      status: "completed"
    },
    {
      title: "Updated project documentation",
      date: "June 8, 2024",
      type: "document",
      status: "completed"
    }
  ];

  const getSkillColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-yellow-100 text-yellow-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                    <input
                      type="text"
                      placeholder="Enter student ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter phone number (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Academic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department / Faculty</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Select Department</option>
                    <option>Computer Science</option>
                    <option>Engineering</option>
                    <option>Business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course / Program</label>
                  <input
                    type="text"
                    placeholder="Enter course/program"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year of Study</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Select Year</option>
                    <option>First Year</option>
                    <option>Second Year</option>
                    <option>Third Year</option>
                    <option>Fourth Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batch / Group</label>
                  <input
                    type="text"
                    placeholder="Enter batch/group"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Current Projects */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FolderOpen className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Current Projects</h2>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  + Add
                </button>
              </div>
              
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600">{project.role}</p>
                        <p className="text-sm text-gray-500">{project.duration}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{project.completion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.completion}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Tools */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <Wrench className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Skills & Tools</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Programming Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.filter(skill => skill.category === 'programming').map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getSkillColor(skill.level)}`}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Design Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.filter(skill => skill.category === 'design').map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getSkillColor(skill.level)}`}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Other Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.filter(skill => skill.category === 'other').map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getSkillColor(skill.level)}`}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Activity Timeline</h2>
              </div>
              
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {activity.type === 'document' && <FileText className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'milestone' && <Award className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'project' && <FolderOpen className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                      {activity.status && (
                        <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Profile Photo */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Upload Photo
                </button>
              </div>
            </div>

            {/* Performance & Contribution */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Performance & Contribution</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Overall Progress</span>
                    <span className="text-sm font-medium text-gray-900">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-600">Tasks Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">4.6</div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Recent Milestones</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database Design Report</span>
                      <span className="text-green-600 text-sm">✓ Submitted</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Documentation</span>
                      <span className="text-yellow-600 text-sm">● Pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Communication */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Communication</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Tell us a bit about yourself</p>
                  <textarea
                    placeholder="Write something about yourself..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Preferred Contact</p>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Email</option>
                    <option>Phone</option>
                    <option>SMS</option>
                  </select>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Status</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account & Access */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Account & Access</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Username</span>
                    <span className="text-sm text-gray-600">Access Level</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="Enter username"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select className="ml-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Student</option>
                      <option>Assistant</option>
                      <option>Admin</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Last Login</span>
                    <span className="text-sm text-gray-600">July 4, 2024 - 10:30 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;