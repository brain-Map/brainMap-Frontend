'use client';

import { useAuth } from '@/contexts/AuthContext';
import NavBar from './NavBar';
import Footer from './footer';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}
