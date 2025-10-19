"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectOverview from "@/app/domain-expert/projects/ProjectOverview";
import KanbanBoard from "@/app/project-member/projects/[id]/Kanban";
import ProjectChat from "@/app/project-member/projects/[id]/ProjectChat";

export default function DomainExpertProjectPage() {
  const params = useParams();
  const projectId = params?.id as string;
  const [activeTab, setActiveTab] = useState<'Overview' | 'Kanban' | 'Calendar' | 'Message' | 'Video'>('Overview');

  useEffect(() => {
    // ensure we default to Overview when mount
    setActiveTab('Overview');
  }, [projectId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto">
        <div className="flex space-x-2 border-b border-gray-200 bg-white pt-4 pl-5">
          <button onClick={() => setActiveTab('Overview')} className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'Overview' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <span>Overview</span>
          </button>
          <button onClick={() => setActiveTab('Calendar')} className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'Calendar' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <span>Calendar</span>
          </button>
          <button onClick={() => setActiveTab('Kanban')} className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'Kanban' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <span>Kanban</span>
          </button>
          <button onClick={() => setActiveTab('Message')} className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'Message' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <span>Message</span>
          </button>
          <button onClick={() => setActiveTab('Video')} className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'Video' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <span>Video</span>
          </button>
        </div>

        <div className="p-5">
          {activeTab === 'Overview' && <ProjectOverview projectId={projectId} />}
          {activeTab === 'Kanban' && <KanbanBoard />}
          {activeTab === 'Message' && <ProjectChat projectId={projectId} projectTitle={undefined} />}
          {activeTab === 'Calendar' && (
            <div className="bg-white rounded-lg border p-6">Calendar view (TODO: integrate calendar component)</div>
          )}
          {activeTab === 'Video' && (
            <div className="bg-white rounded-lg border p-6">Videos view (TODO: integrate videos player/list)</div>
          )}
        </div>
      </div>
    </div>
  );
}
