'use client';
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/superbaseClient'
import { useRouter } from 'next/navigation'

type User = {
  id: string
  email?: string
} | null

const AuthContext = createContext<{
  user: User
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
}>({
  user: null,
  signIn: () => Promise.resolve(null),
  signOut: () => Promise.resolve(),
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        if (event === 'SIGNED_IN') router.push('/')
      }
    )

    return () => authListener.subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const value = {
    user,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)