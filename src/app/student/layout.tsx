'use client';
import Sidebar from '../../components/StudentSideBar';
import Navbar from '../../components/DashboardNavBar';
import React, { ReactNode, useState } from 'react';
import AdminSideBar from '@/components/AdminSideBar';

export default function StudentLayout({ children }: { children: ReactNode }) {
    const [currentPage, setCurrentPage] = useState<string>('dashboard');
  
    const handleNavigate = (url: string) => {
      setCurrentPage(url);
      // In a real app, you would navigate to the actual page
      console.log(`Navigating to: ${url}`);
    };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <AdminSideBar currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="flex-1 bg-gray-50 min-h-[calc(100vh-64px)]">{children}</main>

      </div>
    </div>
  );
}