'use client';

import React, { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import ModeratorSidebar from '@/components/moderator-sidebar';
import DashboardNavBar from '@/components/DashboardNavBar';

export default function ModeratorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState<string>(pathname.split('/').pop() || 'dashboard');

  const handleNavigate = (url: string) => {
    setCurrentPage(url);
    // In a real app, you would navigate to the actual page
    console.log(`Navigating to: ${url}`);
  };

  return (
    <div className="min-h-screen">
      <DashboardNavBar />
      <div className="flex">
        <ModeratorSidebar currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="flex-1 bg-gray-50 min-h-[calc(100vh-64px)]">{children}</main>
      </div>
    </div>
  );
}