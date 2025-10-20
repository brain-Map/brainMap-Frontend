'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import CustomButton from '@/components/CustomButtonModel'
import { supabase } from '@/lib/superbaseClient'

export default function ResetPasswordFlow() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Supabase may include tokens in the URL fragment (#access_token=...&type=...).
  // next/navigation's useSearchParams does NOT read the hash, so parse manually.
  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    if (!hash) {
      // Nothing to do; user probably navigated here directly
      setReady(true)
      return
    }

    const params = new URLSearchParams(hash.replace('#', ''))
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')

    if (access_token) {
      // Set the supabase session so we can call updateUser
      ;(async () => {
        try {
          if (refresh_token) {
            const { data, error } = await supabase.auth.setSession({ access_token, refresh_token })
            if (error) {
              setError(error.message || 'Failed to set session')
            } else {
              // clear the hash so it isn't re-used
              if (typeof window !== 'undefined') window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
              setReady(true)
            }
          } else {
            // @ts-ignore-next-line
            await supabase.auth.setAuth(access_token)
            if (typeof window !== 'undefined') window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
            setReady(true)
          }
        } catch (err: any) {
          setError(err?.message || 'Unexpected error')
        }
      })()
    } else {
      setReady(true)
    }
  }, [])

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.updateUser({ password })
      if (error) {
        setError(error.message || 'Failed to update password')
      } else {
        setSuccess('Password updated successfully. Redirecting to Home...')
        setTimeout(() => router.push('/'), 1500)
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
          <h2 className="text-3xl font-bold text-black mb-2">Set a new password</h2>
          <p className="text-gray-600 text-lg">Enter a new password for your account.</p>
        </div>

        {!ready && <div className="text-center text-gray-600">Preparing...</div>}

        {error && <div className="text-center text-red-600 font-medium">{error}</div>}
        {success && <div className="text-center text-green-600 font-medium">{success}</div>}

        {ready && (
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1 block w-full rounded border px-3 py-2"
                placeholder="Choose a strong password"
              />
            </div>

            <CustomButton text={loading ? 'Saving...' : 'Set new password'} type="submit" className="w-full bg-primary text-white" disabled={loading} />
          </form>
        )}

        <p className="mt-4 text-sm text-gray-600">If you didn't request this, you can safely ignore this message or contact support.</p>
      </div>
    </div>
  )
}
