'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, List, Video , Plus, Edit, MessageSquare, Clock, CheckCircle, SquareKanban, Settings } from 'lucide-react';
// import projects from '@/data/projects/projects';
import KanbanBoard from './Kanban';
import ProjectSettingsPage from './Settings';
import ProjectChat from './ProjectChat';
import { projectApi, ProjectResponse } from '@/services/projectApi';
import api from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';




interface Supervisor {
  id: string;
  name: string;
  title: string;
  email: string;
  avatar: string;
  lastReview: string;
  nextMeeting: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'ACCEPTED' | 'PENDING';
}

interface Activity {
  id: string;
  type: 'task' | 'comment' | 'deadline';
  title: string;
  time: string;
  color: 'blue' | 'green' | 'yellow';
}

interface collaborator {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status:  'ACCEPTED' | 'PENDING';
}

const projectCollaborators ={

  getProjectMember: async (projectId: string) => {
    try {
      const response = await api.get(`/project-member/projects/collaborators/${projectId}`);
      console.log('Collaborators data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      throw error;
    }
  },

}


export default function ProjectOverview({ params }: { params: { id: string } }) {
  const user = useAuth().user;

  console.log('Current user:', user);
  const projectId = params.id;
  const [activeTab, setActiveTab] = useState('Overview');
  const [collaborators, setCollaborators] = useState<collaborator[] | []>([]);



  useEffect(()=>{
    const fetchProjectMembers = async () => {
      const members = await projectCollaborators.getProjectMember(projectId);
      console.log('Project members:', members);
      setCollaborators(members);
    };

    fetchProjectMembers();
  },[projectId])

  
    // Backend data states
      const [backendProjects, setBackendProjects] = useState<ProjectResponse[]>([]);
      const [isLoadingProjects, setIsLoadingProjects] = useState(true);
      const [projectsError, setProjectsError] = useState<string | null>(null);
      const [showOnlyBackendProjects, setShowOnlyBackendProjects] = useState(false);
  
        // Fetch projects from backend
        const fetchProjects = async () => {
          try {
            setIsLoadingProjects(true);
            setProjectsError(null);
            const projects = await projectApi.getProjects(user?.id || '');
            setBackendProjects(projects);
            console.log('Fetched projects:', projects);
          } catch (error: any) {
            console.error('Error fetching projects:', error);
            setProjectsError(error.response?.data?.message || error.message || 'Failed to fetch projects');
          } finally {
            setIsLoadingProjects(false);
          }
        };
      
        // Fetch projects on component mount
        useEffect(() => {
          fetchProjects();
        }, []);
  
  
    const allProjects = showOnlyBackendProjects ? 
      backendProjects.map(project => ({
        id: project.id,
        name: project.title || 'Untitled Project',
        description: project.description || '',
        type: project.type || 'Team-managed software',
        lead: project.lead || { name: 'Unknown', initials: 'UK' },
        starred: false, // You can add this field to your backend response
        status: 'Active', // Assuming all projects are active, you can modify this based on your data
        createdAt: project.createdAt,
        deadline: project.dueDate,
        priority: project.priority,
      })) :
      [
        ...backendProjects.map(project => ({
          id: project.id,
          name: project.title || 'Untitled Project',
          description: project.description || '',
          type: project.type || 'Team-managed software',
          lead: project.lead || { name: 'Unknown', initials: 'UK' },
          starred: false, // You can add this field to your backend response
          status: 'Active', // Assuming all projects are active, you can modify this based on your data
          createdAt: project.createdAt,
          deadline: project.dueDate,
          priority: project.priority,
        })),
  
      ];
      
  const project = allProjects.find((p) => p.id === params.id);

  // Split collaborators into mentors and non-mentors
  const mentorCollaborators = collaborators.filter((c) => c.role === 'MENTOR');
  const memberCollaborators = collaborators.filter((c) => c.role !== 'MENTOR');


  const activities: Activity[] = [
    {
      id: '1',
      type: 'task',
      title: 'Task "Homepage wireframe" completed',
      time: '2 hours ago',
      color: 'blue'
    },
    {
      id: '2',
      type: 'comment',
      title: 'New comment added by Sarah',
      time: '5 hours ago',
      color: 'green'
    },
    {
      id: '3',
      type: 'deadline',
      title: 'Deadline updated',
      time: '1 day ago',
      color: 'yellow'
    }
  ];

  const tabs = [
    { name: 'Overview', icon: Edit },
    { name: 'Calendar', icon: Calendar },
    { name: 'Kanban', icon: SquareKanban  },
    { name: 'Message', icon: MessageSquare },
    { name: 'Video', icon: Video  },
    { name: 'Settings', icon: Settings  },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto">
        {/* Header Tabs */}
        <div className="flex space-x-2 border-b border-gray-200 bg-white pt-4 pl-5">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === tab.name
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>





        {activeTab === 'Overview' && (
          <div className="max-w-7xl mx-auto space-y-6 p-5">
      
      {/* Project Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Project Overview</h1>
        </div>

        <div className="mb-6 border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {project ? project.name : "Project Not Found"}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>CreatedAt: {project ? project.createdAt.split("T")[0] : "N/A"}</span>
              <span>•</span>
              <span>Deadline: {project ? project.deadline : "N/A"}</span>
              <span
                className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium"
              >
                {project ? project.status : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {project ? project.description : "No description available"}
          </p>
        </div>

        
      </div>

      {/* Team Members & Supervisors Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Team Members */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
            
          </div>
          <div className="space-y-3  flex flex-col justify-center">
            {memberCollaborators.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-6 ">
                <div className="w-14 h-14 mb-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center ">
                  {/* User icon SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-8 h-8 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9A3.75 3.75 0 1 1 8.25 9a3.75 3.75 0 0 1 7.5 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 19.5a7.5 7.5 0 0 1 15 0v.75A1.75 1.75 0 0 1 18.25 22H5.75A1.75 1.75 0 0 1 4 20.25v-.75z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm font-medium">No collaborators found</p>
                <p className="text-gray-400 text-xs mt-1">
                  Invite team members to start collaborating.
                </p>
                <button className="mt-4 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium shadow hover:bg-indigo-600 transition">
                  Invite Collaborators
                </button>
              </div>

            ) : (
              memberCollaborators.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt="avatar"
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <img
                              src="https://uvekrjsbsjxvaveqtbnu.supabase.co/storage/v1/object/public/uploads/307ce493-b254-4b2d-8ba4-d12c080d6651.jpg"
                              alt="avatar"
                              className="w-full h-full object-cover rounded-full"
                            />
                          )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.status === "ACCEPTED"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {member.status === "ACCEPTED" ? "Accepted" : "Pending"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Supervisors */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-4">
            Supervisor{mentorCollaborators.length > 1 ? "s" : ""}
          </h3>
          <div className="space-y-4">
            {mentorCollaborators.length === 0 ? (
              <div className="text-sm text-gray-500">No supervisors assigned</div>
            ) : (
              mentorCollaborators.map((mentor) => (
                <div
                  key={mentor.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {mentor.avatar ? (
                            <img
                              src={mentor.avatar}
                              alt="avatar"
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-700">
                              {mentor.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </span>
                          )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{mentor.name}</p>
                      <p className="text-sm text-gray-500">Mentor</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      mentor.status === 'ACCEPTED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {mentor.status === 'ACCEPTED' ? 'Accepted' : 'Pending'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Project Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-4">
          Project Stats
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-sm text-gray-600">Tasks Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">24/37</span>
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Time Spent</span>
            </div>
            <span className="font-medium text-gray-900">142h</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-600">Comments</span>
            </div>
            <span className="font-medium text-gray-900">156</span>
          </div>
        </div>
      </div>
    </div>
          
        )}

        {activeTab === 'Notes' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Notes</h2>
            <p className="text-gray-700">This is the Notes tab content. You can render notes list, rich editor, etc.</p>
          </div>
        )}

        {activeTab === 'Calendar' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Calendar</h2>
            <p className="text-gray-700">Calendar events or date pickers go here.</p>
          </div>
        )}

        {activeTab === 'Kanban' &&  <KanbanBoard />}


      

        {activeTab === 'Message' && (
          <ProjectChat projectId={params.id} projectTitle={project?.name}/>
        )}


        {activeTab === 'Video' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Video Meetings</h2>
            <p className="text-gray-700">Video embed or meeting info.</p>
          </div>
        )}

        {activeTab === 'Settings' && (
          <ProjectSettingsPage />
        )}





        
      </div>
    </div>




  );
}