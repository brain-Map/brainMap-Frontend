'use client';

import React, { ReactNode, useState } from 'react';
import AdminSideBar from '@/components/AdminSideBar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  const handleNavigate = (url: string) => {
    setCurrentPage(url);
    // In a real app, you would navigate to the actual page
    console.log(`Navigating to: ${url}`);
  };

  return (
    <>
      <div className="flex min-h-screen">
        <AdminSideBar currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
    </>
  );
}
