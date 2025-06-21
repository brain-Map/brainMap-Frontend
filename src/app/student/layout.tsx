import Sidebar from '../../components/StudentSideBar';
import React, { ReactNode } from 'react';

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}