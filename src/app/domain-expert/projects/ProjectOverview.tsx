"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectApi, ProjectResponse } from '@/services/projectApi';
import api from '@/utils/api';

interface Collaborator {
  id: string;
  name: string;
  role: string;
  avatar: string | null;
  status: 'ACCEPTED' | 'PENDING';
}

export default function ProjectOverview({ params, projectId }: { params?: { id: string }, projectId?: string }) {
  const id = projectId || params?.id || '';
  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const mentorCollaborators = collaborators.filter((c) => c.role === 'MENTOR');
  const memberCollaborators = collaborators.filter((c) => c.role !== 'MENTOR');

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      try {
        const p = await projectApi.getProject(id);
        setProject(p);
      } catch (err) {
        console.error('Failed to fetch project for overview', err);
      }

      try {
        const res = await api.get(`/project-member/projects/collaborators/${id}`);
        setCollaborators(res.data || []);
      } catch (err) {
        console.error('Failed to fetch collaborators', err);
      }
    };

    fetch();
  }, [id]);

  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-5">
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => router.push('/domain-expert/projects')}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Project Overview</h1>
        </div>

        <div className="mb-6 border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-gray-900">{project ? project.title : 'Project Not Found'}</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>CreatedAt: {project?.createdAt ? project.createdAt.split('T')[0] : 'N/A'}</span>
              <span>•</span>
              <span>Deadline: {project?.dueDate ?? 'N/A'}</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">{project?.status ?? 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">{project?.description ?? 'No description available'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
          </div>
          <div className="space-y-3 flex flex-col justify-center">
            {memberCollaborators.length === 0 ? (
              <div key="no-members" className="flex flex-col items-center justify-center py-10 px-6 ">
                <div className="w-14 h-14 mb-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center "></div>
                <p className="text-gray-600 text-sm font-medium">No collaborators found</p>
                <p className="text-gray-400 text-xs mt-1">Invite team members to start collaborating.</p>
              </div>
            ) : (
              memberCollaborators.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {member.avatar ? (
                        <img src={member.avatar} alt="avatar" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <img src="/image/user_placeholder.jpg" alt="avatar" className="w-full h-full object-cover rounded-full" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {member.status === 'ACCEPTED' ? 'Accepted' : 'Pending'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-4">Supervisor{mentorCollaborators.length > 1 ? 's' : ''}</h3>
          <div className="space-y-4">
            {mentorCollaborators.length === 0 ? (
              <div key="no-supervisors" className="text-sm text-gray-500">No supervisors assigned</div>
            ) : (
              mentorCollaborators.map((mentor) => (
                <div key={mentor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {mentor.avatar ? (
                        <img src={mentor.avatar} alt="avatar" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span className="text-sm font-medium text-gray-700">{mentor.name.split(' ').map(n => n[0]).join('')}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{mentor.name}</p>
                      <p className="text-sm text-gray-500">Mentor</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${mentor.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {mentor.status === 'ACCEPTED' ? 'Accepted' : 'Pending'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
