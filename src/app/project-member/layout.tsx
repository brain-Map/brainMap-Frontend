'use client';
import Sidebar from '../../components/StudentSideBar';
import Navbar from '../../components/DashboardNavBar';
import React, { ReactNode, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function StudentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  console.log('Current Pathname:', pathname);
  const [currentPage, setCurrentPage] = useState<string>(pathname.split('/').pop() || 'dashboard');

  
    const handleNavigate = (url: string) => {
      setCurrentPage(url);
      // sidebarRef.current = url;
      // In a real app, you would navigate to the actual page
      //console.log(Navigating to: ${url});
    };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="flex-1 bg-gray-50 min-h-[calc(100vh-64px)]">{children}</main>
      </div>
    </div>
  );
}