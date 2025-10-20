'use client'

import React, { useState } from 'react'
import CustomButton from '@/components/CustomButtonModel'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function ForgotPasswordPage() {
  const { sendPasswordResetEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const { data, error } = await sendPasswordResetEmail(email)
      if (error) {
        setError(error.message || 'Failed to send reset email')
      } else {
        setSuccess('If the email exists, a password reset link has been sent. Please check your inbox.')
      }
    } catch (err: any) {
      setError(err?.message || 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 p-10 bg-white rounded-2xl shadow-(--my-shadow)">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black mb-2">Reset password</h2>
          <p className="text-gray-600 text-lg">Enter your email and we'll send a password reset link.</p>
        </div>

        {error && <div className="text-center text-red-600 font-medium">{error}</div>}
        {success && <div className="text-center text-green-600 font-medium">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <CustomButton
            type="submit"
            text={loading ? 'Sending...' : 'Send reset email'}
            className="w-full bg-primary hover:bg-secondary text-white hover:text-black"
            disabled={loading}
          />

          <p className="text-center text-black">
            Remembered?{' '}
            <Link href="/login" className="text-blue-600 hover:text-primary hover:underline underline-offset-2 font-medium transition-colors duration-200">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
