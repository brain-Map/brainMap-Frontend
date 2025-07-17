'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/superbaseClient';
import { useRouter, useSearchParams } from 'next/navigation';

type User = {
  id: string;
  email?: string;
  name?: string;
  user_role?: string;
} | null;

const AuthContext = createContext<{
  user: User;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateUserMetadata: (metadata: { name?: string; user_role?: string }) => Promise<any>;
}>({
  user: null,
  signIn: () => Promise.resolve(null),
  signOut: () => Promise.resolve(),
  updateUserMetadata: () => Promise.resolve(null),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const mapSupabaseUser = (supabaseUser: any): User => {
    if (!supabaseUser) return null;
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: supabaseUser.user_metadata?.name,
      user_role: supabaseUser.user_metadata?.user_role,
    };
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      localStorage.setItem('accessToken', session?.access_token || '');
      console.log(session?.access_token);
      setUser(mapSupabaseUser(session?.user));
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('accessToken');
        setUser(null);
      } else {
        localStorage.setItem('accessToken', session?.access_token || '');
        setUser(mapSupabaseUser(session?.user));
      }
  }
);

    return () => authListener.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      const redirectTo = searchParams.get('redirectTo') || '/';
      router.push(redirectTo);
    }

    return { error };
  };

  const signOut = async () => {
    localStorage.removeItem('accessToken');
    await supabase.auth.signOut();
    router.push('/');
  };

  const updateUserMetadata = async (metadata: { name?: string; user_role?: string }) => {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata
    });

    if (!error && data.user) {
      setUser(mapSupabaseUser(data.user));
    }

    return { data, error };
  };

  const value = {
    user,
    signIn,
    signOut,
    updateUserMetadata,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
