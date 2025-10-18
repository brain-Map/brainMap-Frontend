'use client'

import React, { useState } from 'react'
import CustomButton from '../../components/CustomButtonModel'
import { Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/superbaseClient'

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

 const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })  

    if (error) {
      setError(error.message)

    } else {
      console.log('Login successful:', data)
      localStorage.setItem('accessToken', data?.session?.access_token || '');
      console.log(data?.session?.access_token);
      
      router.push('/')
    }
  }
  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-(--my-shadow)">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black mb-2">Login</h2>
            <p className="text-gray-600 text-lg">
              Access your brainMap account
            </p>
          </div>

          {error && (
            <div className="text-center text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full pl-12 pr-4 py-3 bg-white text-black rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7091E6] placeholder-gray-400"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-12 pr-4 py-3 bg-white text-black rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7091E6] placeholder-gray-400"
              />
            </div>

            <CustomButton
              type="submit"
              text="Login"
              className="w-full bg-primary hover:bg-secondary text-white hover:text-black transition-colors duration-200"
            />

            <p className="text-center text-black">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-blue-600 hover:text-primary hover:underline underline-offset-2 font-medium transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>

            <p className="text-center text-black">
              Lost password?{' '}
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:text-primary hover:underline underline-offset-2 font-medium transition-colors duration-200"
              >
                Reset it
              </Link>
            </p>
            
          </form>
        </div>
      </div>
    </>
  )
}
