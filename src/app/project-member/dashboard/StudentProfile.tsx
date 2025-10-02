'use client';
import React, { use, useState, useEffect } from 'react';
import { 
  User, 
  CheckCircle, 
  Star, 
  MessageCircle, 
  Edit3, 
  MapPin,
  Building2,
  Mail,
  Phone,
  Ellipsis ,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';


export interface User {
  id: string;
  firstname: string;
  lastname: string;
  username?: string;
  email: string;
  role: string;
  about?: string;
  location?: string;
  phone?: string;
  company?: string;
  fieldsOfInterest?: string[];
  followers?: number;
  following?: number;
  profileViews?: number;
  isVerified?: boolean;
  avatar?: string;
}

export interface OneUser{
    id: string;
    firstName:string;
    lastName:string;
    username: string;
    email: string;
    mobileNumber?: string;
    dateOfBirth?:string;
    userRole:string;
    createdAt:string;
    status:string;
    city?:string;
    gender: string;
    bio?:string;
    avatar:string;
}

export interface UserAbout {
  id?: string;
  about: string;
}

const userService = {
  getUser: async (userId: string): Promise<User> => {
    try {
      const response = await api.get(`/api/project-member/${userId}`);
      console.log('User Data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  getOneUserData: async (userId: string): Promise<OneUser> => {
    try {
      const response = await api.get(`/api/v1/users/${userId}`);
      console.log('User Data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  updateAbout: async (Id: string, userData: Partial<UserAbout>): Promise<UserAbout> => {
    try {
      const response = await api.put(`/api/project-member/update-about/${Id}`, userData);
      console.log('User updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  getProjectData: async (userId: string) => {
    try {
      const response = await api.get(`/project-member/projects/all/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }
};

const ProjectDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const user1 = useAuth().user;
  // const user1 = auth.user;
  const [user, setUser] = useState<User | null>(null);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState('');
  const [userAbout, setUserAbout] = useState<UserAbout | null>(null);
  const [oneUserData, setOneUserData] = useState<OneUser | null>(null);
  const [projects, setProjects] = useState<any[]>([]);

  console.log('User in ProjectDashboard:', user1);

  const userId = user1?.id;

  useEffect(() => {
    const updateUserAbout = async () => {
      if (!userAbout) return;

      try {
        await userService.updateAbout(userId ? userId : '', { about: userAbout.about });
        console.log('User about updated successfully');
      } catch (error) {
        console.error('Error updating user about:', error);
      }
    };

    updateUserAbout();
  }, [userAbout]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const userData = await userService.getUser(userId);
        const oneUserData = await userService.getOneUserData(userId);
        const projectData = await userService.getProjectData(userId);
        setUser(userData);
        setAboutText(userData.about || '');
        setOneUserData(oneUserData);
        setProjects(projectData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, [userId]);

  const handleEditAbout = () => {
    setIsEditingAbout(true);
  };

  const handleSaveAbout = () => {
    // Update the user state with new about text
    if (user) {
      setUserAbout({ id:userId, about: aboutText });
      // console.log('user', user);
    }
    // Here you can add API call to save to backend
    // await userService.updateUser(userId, { about: aboutText });
    setIsEditingAbout(false);
  };

  const handleCancelAbout = () => {
    // Reset text to original value
    setAboutText(user?.about || '');
    setIsEditingAbout(false);
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
                <div className="w-50 h-50 mx-auto rounded-full overflow-hidden  bg-gradient-to-br from-red-500 to-red-700">
                  <div className="w-full h-full flex items-center justify-center">
                    {oneUserData?.avatar ? (
                      <img
                        src={oneUserData.avatar}
                        alt="User Avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-20 h-20 text-white" />
                    )}



                  </div>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h1 className="text-xl font-bold text-gray-900">{user1?.name}</h1>
                  {user?.isVerified && <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>
                <p className="text-gray-600 text-sm">@{user?.username}</p>
              </div>

              <button
              onClick={() => router.push('/project-member/settings')}
              className="w-full bg-primary hover:bg-secondary hover:text-black text-white py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>

            {/* Profile Stats */}
            <div className=" p-6 border-t border-gray-200 ">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">Profile Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Project Ongoing</span>
                  {/* <span className="font-semibold text-gray-900">3</span> */}
                  <span className="font-semibold text-gray-900">{projects.filter(p => p.status === 'ACTIVE').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Projects Completed</span>
                  {/* <span className="font-semibold text-gray-900">{completedProjects.length}</span> */}
                  <span className="font-semibold text-gray-900">{projects.filter(p => p.status === 'DONE').length}</span>
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
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6 relative">
              {/* Edit Icon - top right */}
              {!isEditingAbout && (
                <button 
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" 
                  onClick={handleEditAbout}
                  title="Edit About"
                >
                  <Ellipsis className="text-gray-500 hover:text-gray-800" />
                </button>
              )}

              <h3 className="font-semibold text-xl mb-4 text-gray-900">About Me</h3>

              {/* About text or edit mode */}
              {isEditingAbout ? (
                <div className="space-y-4">
                  <textarea
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={handleCancelAbout}
                      className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAbout}
                      className="px-4 py-2 text-white bg-primary hover:bg-secondary hover:text-black rounded-lg transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* About text or fallback message */}
                  {user?.about ? (
                    <p className="text-gray-600 mb-4 leading-relaxed">{user.about}</p>
                  ) : (
                    <p className="text-gray-400 italic mb-4 leading-relaxed">No about information provided. Click the three dots to add one.</p>
                  )}
                </>
              )}
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
                    {projects.filter(p => p.status === 'ACTIVE').length === 0 ? (
                      <div className="text-gray-400 italic text-center py-8">No ongoing projects.</div>
                    ) : (
                      projects.filter(p => p.status === 'ACTIVE').map((project) => (
                        <div key={project.id} className=" rounded-lg p-4 hover:bg-gray-100 transition-colors border-t border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                            <div className="flex items-center gap-2">
                              {/* <Star className="w-4 h-4 text-yellow-500 fill-current" /> */}
                              <span className="text-sm text-gray-600">{project.priority}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span>Team: {project.team} members</span>
                            <span>Budget: ${project.budget?.toLocaleString?.() ?? project.budget}</span>
                            <span>Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : '-'}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                  
                </>
              )}

              {activeTab === 'projects' && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 ">
                  <h3 className="font-semibold text-xl mb-6 text-gray-900">Completed Projects</h3>
                  <div className="">
                    {projects.filter(p => p.status !== 'ACTIVE').length === 0 ? (
                      <div className="text-gray-400 italic text-center py-8">No completed projects.</div>
                    ) : (
                      projects.filter(p => p.status !== 'ACTIVE').map((project) => (
                        <div key={project.id} className="rounded-lg p-4 hover:bg-gray-100 transition-colors border-t border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm text-gray-600">{project.rating ?? '-'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span>Team: {project.team} members</span>
                            <span>Budget: ${project.budget?.toLocaleString?.() ?? project.budget}</span>
                            <span>Completed: {project.completionDate ? new Date(project.completionDate).toLocaleDateString() : '-'}</span>
                          </div>
                        </div>
                      ))
                    )}
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