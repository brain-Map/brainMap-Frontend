'use client';
import React, { useState } from 'react';
import { Calendar, List, Video , Plus, Edit, MessageSquare, File, Clock, CheckCircle, SquareKanban  } from 'lucide-react';
import projects from '@/data/projects/projects';
import KanbanBoard from './Kanban';


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
  status: 'Lead' | 'Active' | 'Inactive';
}

interface Activity {
  id: string;
  type: 'task' | 'comment' | 'deadline';
  title: string;
  time: string;
  color: 'blue' | 'green' | 'yellow';
}


export default function ProjectOverview({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('Overview');

  const project = projects.find((p) => p.id === params.id);
  
  const supervisors: Supervisor[] = [
    {
      id: '1',
      name: 'Dr. James Wilson',
      title: 'Project Manager',
      email: 'james.wilson@company.com',
      avatar: '/api/placeholder/40/40',
      lastReview: '2 days ago',
      nextMeeting: 'Tomorrow, 2 PM'
    },
    {
      id: '2',
      name: 'Sarah Mitchell',
      title: 'Lead Designer',
      email: 'sarah.mitchell@company.com',
      avatar: '/api/placeholder/40/40',
      lastReview: '1 week ago',
      nextMeeting: 'Friday, 10 AM'
    }
  ];

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'UI/UX Designer',
      avatar: '/api/placeholder/40/40',
      status: 'Lead'
    },
    {
      id: '2',
      name: 'Mike Chen',
      role: 'Frontend Developer',
      avatar: '/api/placeholder/40/40',
      status: 'Active'
    },
    {
      id: '3',
      name: 'Alex Rodriguez',
      role: 'Backend Developer',
      avatar: '/api/placeholder/40/40',
      status: 'Active'
    }
  ];

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
    { name: 'Notes', icon: Edit },
    { name: 'Calendar', icon: Calendar },
    { name: 'Kanban', icon: SquareKanban  },
    { name: 'Message', icon: MessageSquare },
    { name: 'Video', icon: Video  },
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-5">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Project Overview</h1>
                <button className="bg-primary hover:bg-secondary hover:text-black text-white px-4 py-2 rounded-md flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Property</span>
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">{project ? project.name : 'Project Not Found'}</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">CreatedAt: {project ? project.createdAt : 'Project Not Found'}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">Deadline:{project ? project.deadline : 'Project Not Found'}</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      {project ? project.status : 'Project Not Found'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900">Description</h3>
                  <Edit className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {project ? project.description : 'Project Not Found'}
                </p>
              </div>

              {/* Custom Properties */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Custom Properties</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <span className="text-red-600 font-medium">High</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                      <span className="text-gray-900">TechCorp Inc.</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                      <span className="text-gray-900 font-medium">$50,000</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Progress</label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">65%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                    <Plus className="w-4 h-4" />
                    <span>Add Member</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-value3/40 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-00 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === 'Lead' ? 'bg-blue-100 text-blue-800' :
                        member.status === 'Active' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Supervisors */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Supervisor{supervisors.length > 1 ? 's' : ''}
              </h3>
              <div className="space-y-4">
                {supervisors.map((supervisor) => (
                  <div key={supervisor.id} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-gray-700">
                        {supervisor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{supervisor.name}</p>
                      <p className="text-sm text-gray-500">{supervisor.title}</p>
                      <p className="text-sm text-blue-600 truncate">{supervisor.email}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Last Review:</span>
                          <span className="text-gray-900">{supervisor.lastReview}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Next Meeting:</span>
                          <span className="text-gray-900">{supervisor.nextMeeting}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Project Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-sm text-gray-600">Tasks Completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">24/37</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
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

            {/* Recent Activity */}
            {/* <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.color === 'blue' ? 'bg-blue-500' :
                      activity.color === 'green' ? 'bg-green-500' :
                      'bg-yellow-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
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
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Messages</h2>
            <p className="text-gray-700">Team chat or message threads.</p>
          </div>
        )}


        {activeTab === 'Video' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Video Meetings</h2>
            <p className="text-gray-700">Video embed or meeting info.</p>
          </div>
        )}





        
      </div>
    </div>




  );
}