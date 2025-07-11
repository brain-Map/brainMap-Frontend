"use client"
import type React from "react"
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/domainExpert/sideBar"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isVideoCallPage = pathname.includes('/video-calls/call')

  if(isVideoCallPage){
    return <main className="min-h-screen">{children}</main>
  }
  return (
    <>
        <div className="flex min-h-screen bg-gray-50 w-[100%]">
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
    </>
  )
}
