'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  CheckSquare,
  Folder,
  Star,
  StickyNote,
  Settings,
  MoreVertical,
} from 'lucide-react';

const StudentSidebar = () => {
  return (
    <aside className="w-[260px] h-screen bg-white border-r border-gray-200 flex flex-col justify-between shadow-sm">
      {/* Top Logo */}
      <div>
        <div className="flex items-center justify-center h-[80px] border-b border-gray-100">
          <img src="/image/BrainMap.png" alt="BrainMap" className="h-10" />
        </div>

        {/* Navigation Menu */}
        <div className="mt-4 px-4 space-y-1 text-sm text-gray-600 font-medium">
          <SidebarItem icon={<Calendar size={18} />} label="Calendar" />
          <SidebarItem icon={<CheckSquare size={18} />} label="Todo" />
          <SidebarItem icon={<Folder size={18} />} label="Projects" active />
          <SidebarItem icon={<Star size={18} />} label="Starred" />
          <SidebarItem icon={<StickyNote size={18} />} label="Notes" />
        </div>

        {/* Projects Section */}
        <div className="mt-8 px-4">
          <p className="text-xs text-gray-400 font-semibold mb-3">PROJECTS</p>
          <ProjectItem iconColor="bg-yellow-400" label="Flower Shop" count={23} />
          <ProjectItem iconColor="bg-red-600" label="Cloth" count={345} />
          <ProjectItem iconColor="bg-orange-400" label="Gamer Boy" count={568} />
        </div>
      </div>

      {/* Bottom User Info */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/image/user-avatar.png"
              alt="User"
              className="w-10 h-10 rounded-full border border-gray-300"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Muhammed Ali</p>
              <p className="text-xs text-gray-400">Free Account</p>
            </div>
          </div>
          <Settings size={16} className="text-gray-400" />
        </div>
      </div>
    </aside>
  );
};

const SidebarItem = ({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) => (
  <button
    className={`flex items-center w-full px-3 py-2 rounded-md ${
      active ? 'bg-gray-100 text-black font-semibold' : 'hover:bg-gray-50'
    }`}
  >
    <span className="mr-3 text-lg">{icon}</span>
    {label}
  </button>
);

const ProjectItem = ({
  iconColor,
  label,
  count,
}: {
  iconColor: string;
  label: string;
  count: number;
}) => (
  <div className="flex items-center justify-between text-sm py-2 px-2 hover:bg-gray-50 rounded-md">
    <div className="flex items-center space-x-2">
      <div className={`w-5 h-5 rounded-full ${iconColor}`}></div>
      <span className="text-gray-700">{label}</span>
    </div>
    <span className="text-gray-400 text-xs">{count}</span>
  </div>
);

export default StudentSidebar;