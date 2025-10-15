'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/superbaseClient';
import { useRouter, useSearchParams } from 'next/navigation';

type User = {
  id: string;
  email?: string;
  name?: string;
  user_role?: string;
  about?: string;
  profile_picture?: string;
  
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateUserMetadata: (metadata: { name?: string; user_role?: string }) => Promise<{ data: any, error: any }>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  updateUserMetadata: async () => ({ data: null, error: null }),
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
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) console.error("Session error:", error.message);
        if (session?.user) {
          localStorage.setItem('accessToken', session.access_token);
          setUser(mapSupabaseUser(session.user));
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Unexpected session fetch error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('accessToken');
        console.log("User signed out");
        setUser(null);
      } else if (session?.user) {
        localStorage.setItem('accessToken', session.access_token);
        setUser(mapSupabaseUser(session.user));

        const user_role = localStorage.getItem("user_role");
        if (!session.user.user_metadata?.user_role && user_role) {
          supabase.auth.updateUser({
            data: { user_role },
          }).then(({ error }) => {
            if (error) console.error("Error updating user role:", error);
          });
        }
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      const redirectTo = searchParams.get('redirectTo') || '/';
      setTimeout(() => router.push(redirectTo), 200);
    }
    return { error };
  };

  const signOut = async () => {
    localStorage.removeItem('accessToken');
    await supabase.auth.signOut();
    router.push('/');
  };

  const updateUserMetadata = async (metadata: { name?: string; user_role?: string }) => {
    const { data, error } = await supabase.auth.updateUser({ data: metadata });
    if (!error && data?.user) {
      setUser(mapSupabaseUser(data.user));
    }
    return { data, error };
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    updateUserMetadata,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
