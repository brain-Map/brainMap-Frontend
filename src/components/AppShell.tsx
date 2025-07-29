'use client';

import { useAuth } from '@/contexts/AuthContext';
import NavBar from './NavBar';
import Footer from './footer';
import { usePathname } from 'next/navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  const pathname = usePathname();

  const isDashboard = 
    pathname.startsWith('/admin') || 
    pathname.includes('/dashboard')
  ;

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <div className=''>{children}</div>
      {!isDashboard && <Footer />}
    </>
  );
}
