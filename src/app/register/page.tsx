'use client';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/NavBarModel';
import Register from './register';
import UserRegistrationForm from './role';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  return (
    <>
      <Navbar />
      {!role ? <Register /> : <UserRegistrationForm />}
    </>
  );
}
