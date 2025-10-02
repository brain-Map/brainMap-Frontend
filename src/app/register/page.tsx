'use client';
import { useSearchParams } from 'next/navigation';
import Register from './roleSelection';
import AccountCreation from './createAccount';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  return (
    <>
      {!role ? <Register /> : <AccountCreation />}
    </>
  );
}
