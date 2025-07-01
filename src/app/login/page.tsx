'use client';

import React, { useState } from 'react';
import NavBar from '../../components/NavBarModel';
import CustomButton from '../../components/CustomButtonModel';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Logging in with:', { email, password });
  };

  return (
    <>
      {/* <NavBar /> */}
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-primary via-secondary to-primary">
        <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Login</h1>
            <p className="text-value3 mt-2">Access your brainMap account</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Mail className="w-5 h-5 text-accent absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full pl-12 pr-4 py-3 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-accent absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-12 pr-4 py-3 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <CustomButton
              text="Login"
              type="submit"
              backgroundColor="bg-gradient-to-r from-accent to-info"
              textColor="text-white"
              hoverBackgroundColor="hover:opacity-90"
              width="w-full"
            />
          </form>
          <div className="text-center text-value3">
            <p>
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold text-accent hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 