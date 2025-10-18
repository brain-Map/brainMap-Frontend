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
  updatePassword: (newPassword: string) => Promise<{ data: any, error: any }>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  updateUserMetadata: async () => ({ data: null, error: null }),
  updatePassword: async () => ({ data: null, error: null }),
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
        const isVerified = (u: any) => Boolean(u?.email_confirmed_at || u?.confirmed_at || u?.email_confirmed);

        if (session?.user) {
          // Only treat the user as authenticated if their email is verified
          if (isVerified(session.user)) {
            localStorage.setItem('accessToken', session.access_token);
            setUser(mapSupabaseUser(session.user));
          } else {
            // Don't treat unverified users as logged in
            localStorage.removeItem('accessToken');
            setUser(null);
          }
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
      const isVerified = (u: any) => Boolean(u?.email_confirmed_at || u?.confirmed_at || u?.email_confirmed);

      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('accessToken');
        console.log("User signed out");
        setUser(null);
      } else if (session?.user) {
        // If user is not verified, prevent login
        if (!isVerified(session.user)) {
          console.log('User signed in but email not verified — signing out');
          localStorage.removeItem('accessToken');
          // Clear any server session
          supabase.auth.signOut().catch(err => console.error('Error signing out unverified user', err));
          setUser(null);
          return;
        }

        localStorage.setItem('accessToken', session.access_token);
        setUser(mapSupabaseUser(session.user));

        // Ensure user_role metadata is set if we stored it locally during signup
        const user_role = localStorage.getItem("user_role");
        if (!session.user.user_metadata?.user_role && user_role) {
          supabase.auth.updateUser({
            data: { user_role },
          }).then(({ error }) => {
            if (error) console.error("Error updating user role:", error);
          });
        }

        // If there's a pending registration (created at signup time), call backend now that the user is verified
        (async () => {
          try {
            const pending = localStorage.getItem('pendingRegistration');
            if (!pending) return;

            const payload = JSON.parse(pending);
            // Attach confirmed user id from Supabase session
            payload.userId = session.user.id;

            const token = session.access_token;
            const backendUrl = `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/users/register`;

            const resp = await fetch(backendUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(payload),
            });

            if (resp.ok) {
              console.log('Backend registration completed successfully');
              localStorage.removeItem('pendingRegistration');
            } else {
              const errText = await resp.text();
              console.error('Backend registration failed', errText);
            }
          } catch (err) {
            console.error('Error processing pending registration:', err);
          }
        })();
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

  const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  return { data, error };
};


  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    updateUserMetadata,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
