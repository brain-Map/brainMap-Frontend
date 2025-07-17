'use client';
import Sidebar from '../../components/ProjectMemberSideBar';
import React, { ReactNode, useMemo } from 'react';
import { usePathname } from 'next/navigation';

export default function StudentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Derive currentPage directly from pathname
  const currentPage = useMemo(() => {
    const pathParts = pathname.split('/');
    return pathParts[pathParts.length - 1] || 'dashboard';
  }, [pathname]);

  // Sidebar can handle navigation via Next.js router internally
  return (
    <div className="min-h-screen">
      <div className="flex">
        <Sidebar currentPage={currentPage} />
        <main className="flex-1 bg-gray-50 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
