'use client';
import React, { useState } from 'react';
import { 
  User, 
  CheckCircle, 
  Star, 
  MessageCircle, 
  Edit3, 
  MapPin,
  Building2,
  Mail,
  Phone
} from 'lucide-react';

const ProjectDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const user = {
    fullName: "Nadun Madusanka",
    username: "nadu_nm",
    role: "Project Member",
    isVerified: true,
    bio: "Passionate project manager with 5+ years experience in leading cross-functional teams and delivering high-impact solutions.",
    avatar: "/api/placeholder/280/280",
    location: "San Francisco, CA",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Inc.",
    fieldsOfInterest: ["Project Management", "Agile", "Scrum", "Leadership", "Strategy"],
    followers: 127,
    following: 89,
    profileViews: 2456
  };

  const currentProjects = [
    {
      id: 1,
      title: "E-Commerce Platform Redesign",
      startDate: "2024-01-15",
      status: "In Progress",
      progress: 65,
      team: 8,
      budget: 125000,
      deadline: "2024-06-30",
      priority: "High"
    },
    {
      id: 2,
      title: "Mobile App Development",
      startDate: "2024-02-01",
      status: "Planning",
      progress: 25,
      team: 5,
      budget: 75000,
      deadline: "2024-08-15",
      priority: "Medium"
    },
    {
      id: 3,
      title: "Cloud Infrastructure Migration",
      startDate: "2024-01-20",
      status: "In Progress",
      progress: 80,
      team: 6,
      budget: 150000,
      deadline: "2024-05-30",
      priority: "Critical"
    }
  ];

  const completedProjects = [
    { 
      title: "Mobile App Development", 
      completionDate: "2023-12-10", 
      id: 1,
      team: 6,
      budget: 85000,
      rating: 4.8
    },
    { 
      title: "Database Migration", 
      completionDate: "2023-11-22", 
      id: 2,
      team: 4,
      budget: 45000,
      rating: 4.9
    },
    { 
      title: "API Integration", 
      completionDate: "2023-10-08", 
      id: 3,
      team: 3,
      budget: 32000,
      rating: 4.7
    }
  ];

  const hiredExperts = [
    { 
      name: "Dr. Alex Chen", 
      expertise: "Machine Learning", 
      hiredDate: "2024-01-20", 
      rating: 4.9,
      id: 1,
      hourlyRate: 150,
      totalHours: 48
    },
    { 
      name: "Maria Rodriguez", 
      expertise: "UI/UX Design", 
      hiredDate: "2024-01-18", 
      rating: 4.8,
      id: 2,
      hourlyRate: 120,
      totalHours: 72
    },
    { 
      name: "James Wilson", 
      expertise: "Cloud Architecture", 
      hiredDate: "2024-01-10", 
      rating: 4.7,
      id: 3,
      hourlyRate: 180,
      totalHours: 36
    }
  ];

  const activityData = [
    { month: "Jan", projects: 2, completed: 1 },
    { month: "Feb", projects: 3, completed: 2 },
    { month: "Mar", projects: 4, completed: 3 },
    { month: "Apr", projects: 3, completed: 2 },
    { month: "May", projects: 5, completed: 4 },
    { month: "Jun", projects: 4, completed: 3 }
  ];

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'projects', label: 'Projects' },
    { key: 'experts', label: 'Hired Experts' },
    { key: 'activity', label: 'Activity' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className=" max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar - User Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className=" rounded-xl p-6">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-300 bg-gradient-to-br from-red-500 to-red-700">
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h1 className="text-xl font-bold text-gray-900">{user.fullName}</h1>
                  {user.isVerified && <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>
                <p className="text-gray-600 text-sm">@{user.username}</p>
              </div>

              <button className="w-full bg-primary hover:bg-secondary hover:text-black text-white py-2.5 px-4 rounded-lg transition-colors duration-200 mb-6 flex items-center justify-center gap-2">
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>

              <div className="flex justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{user.followers}</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{user.following}</div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span>{user.company}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{user.phone}</span>
                </div>
              </div>
            </div>

            {/* Profile Stats */}
            <div className=" p-6 border-t border-gray-200 ">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">Profile Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profile Views</span>
                  <span className="font-semibold text-gray-900">{user.profileViews.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Projects Completed</span>
                  <span className="font-semibold text-gray-900">{completedProjects.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Experts Hired</span>
                  <span className="font-semibold text-gray-900">{hiredExperts.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            

            {/* About Me Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200  mb-6">
              <h3 className="font-semibold text-xl mb-4 text-gray-900">About Me</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{user.bio}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎓</span>
                  <span className="text-gray-600">Currently working as {user.role} at {user.company}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📈</span>
                  <span className="text-gray-600">Specializing in project management, team leadership, and strategic planning</span>
                </div>
              </div>
            </div>

            {/* Fields of Interest */}
            <div className="bg-white rounded-xl p-6 border border-gray-200  mb-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">Fields of Interest</h3>
              <div className="flex flex-wrap gap-2">
                {user.fieldsOfInterest.map((field, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-value3 text-primary rounded-full text-sm border border-value2 hover:bg-value3 transition-colors"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.key
                        ? 'border-primary text-peimary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <>
                  {/* Current Projects */}
                  
                  <div className="bg-white rounded-xl p-6 border border-gray-200 ">
                  <h3 className="font-semibold text-xl mb-6 text-gray-900">Ongoing Projects</h3>
                  <div className="">
                    {currentProjects.map((currentProjects) => (
                      <div key={currentProjects.id} className=" rounded-lg p-4 hover:bg-gray-100 transition-colors border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{currentProjects.title}</h4>
                          <div className="flex items-center gap-2">
                            {/* <Star className="w-4 h-4 text-yellow-500 fill-current" /> */}
                            <span className="text-sm text-gray-600">{currentProjects.priority}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span>Team: {currentProjects.team} members</span>
                          <span>Budget: ${currentProjects.budget.toLocaleString()}</span>
                          <span>Deadline: {new Date(currentProjects.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                  
                </>
              )}

              {activeTab === 'projects' && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 ">
                  <h3 className="font-semibold text-xl mb-6 text-gray-900">Completed Projects</h3>
                  <div className="">
                    {completedProjects.map((project) => (
                      <div key={project.id} className="rounded-lg p-4 hover:bg-gray-100 transition-colors border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">{project.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span>Team: {project.team} members</span>
                          <span>Budget: ${project.budget.toLocaleString()}</span>
                          <span>Completed: {new Date(project.completionDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'experts' && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-xl mb-6 text-gray-900">Hired Domain Experts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {hiredExperts.map((expert) => (
                        <div
                          key={expert.id}
                          className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 max-w-sm"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-md">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{expert.name}</h4>
                              <p className="text-sm text-gray-500">{expert.expertise}</p>
                            </div>
                          </div>

                          <div className="text-sm text-gray-600 mb-4 grid grid-cols-2 gap-y-2">
                            <div><span className="font-medium text-gray-900">Rate:</span> ${expert.hourlyRate}/hr</div>
                            <div><span className="font-medium text-gray-900">Hours:</span> {expert.totalHours}</div>
                            <div><span className="font-medium text-gray-900">Rating:</span> {expert.rating}/5</div>
                            <div><span className="font-medium text-gray-900">Hired:</span> {new Date(expert.hiredDate).toLocaleDateString()}</div>
                          </div>

                          <a
                            // href={`mailto:${expert.email}`}
                            className="w-full inline-flex justify-center items-center gap-2 text-white bg-primary hover:bg-secondary hover:text-black py-2 px-4 rounded-lg transition-colors duration-200"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Contact
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

              )}

              {activeTab === 'activity' && (
                
                <h1>
                  hello world
                </h1>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;