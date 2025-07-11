'use client';
import { useSearchParams } from 'next/navigation';
import Register from './register';
import UserRegistrationForm from './role';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  return (
    <>
      {!role ? <Register /> : <UserRegistrationForm />}
    </>
  );
}
