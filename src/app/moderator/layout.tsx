"use client";

import React, { ReactNode, useState, useEffect } from "react";
import AdminSideBar from "@/components/admin/AdminSideBar";
// import AdminNavbar from "@/components/admin/AdminNavbar";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState<string>(pathname || "/admin");
  
  useEffect(() => {
    setCurrentPage(pathname);
  }, [pathname]);
  
  const handleNavigate = (url: string) => {
    setCurrentPage(url);
    router.push(url);
  };

  return (
    <>
      <div className="flex min-h-screen">
        <AdminSideBar currentPage={currentPage} onNavigate={handleNavigate} />
        <div className="flex-1 flex flex-col">
          {/* <AdminNavbar title="Admin Dashboard" /> */}
          <main className="flex-1 bg-gray-50">{children}</main>
        </div>
      </div>
    </>
  );
}
