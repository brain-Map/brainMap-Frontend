'use client';

import { useAuth } from '@/contexts/AuthContext';
import NavBar from './NavBar';
import Footer from './footer';
import { usePathname } from 'next/navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  const pathname = usePathname();

  const { user } = useAuth();

  const isDashboard = 
    pathname.startsWith('/admin') || 
    pathname.includes('/dashboard')
  ;

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  // Add a role-based class on the top-level wrapper. CSS will read
  // `.role-mentor` to override primary color variables when the user is a mentor.
  const roleClass = user?.user_role === 'Mentor' ? 'role-mentor' : '';

  return (
    <div className={roleClass}>
      <NavBar />
      <div className="">{children}</div>
      {!isDashboard && <Footer />}
    </div>
  );
}
