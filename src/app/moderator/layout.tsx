"use client"
import type React from "react"
import ModeratorSidebar from '@/components/moderator-sidebar';
import DashboardNavBar from '@/components/DashboardNavBar';
import { usePathname } from "next/navigation"

export default function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname()
  
  return (
    <>
      <DashboardNavBar />
      <div className="flex min-h-screen bg-gray-50 w-[100%]">
        <ModeratorSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}