import Sidebar from '../../components/SideBar';
import React, { ReactNode } from 'react';

export default function TestLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
