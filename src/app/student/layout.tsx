import Sidebar from '../../components/StudentSideBar';
import Navbar from '../../components/DashboardNavBar';
import React, { ReactNode } from 'react';

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 bg-gray-50 min-h-[calc(100vh-64px)]">{children}</main>
      </div>
    </div>
  );
}