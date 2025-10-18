"use client";
import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/superbaseClient';
import CustomButton from '@/components/CustomButtonModel';
import { Mail, CheckCircle, RefreshCw, LogOut } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawEmail = searchParams.get('email') || '';
  const email = rawEmail;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const lastResendAttemptRef = React.useRef<number | null>(null);
  const intervalRef = React.useRef<number | null>(null);

  const handleResend = async () => {
    if (!email) {
      setMessage('No email available to resend confirmation.');
      return;
    }

    // record user click time so countdown can start from click moment
    lastResendAttemptRef.current = Date.now();
    setLoading(true);
    setMessage(null);
    setSuccess(false);
    try {
      // Re-trigger Supabase signUp to resend verification email. For production consider
      // using a server-side Admin API call to resend confirmation emails instead.
      const { error } = await supabase.auth.signUp({ email, password: Math.random().toString(36).slice(2) });
      if (error) {
        setMessage(error.message || 'Unable to resend verification email.');
        setSuccess(false);
      } else {
        setMessage('Verification email resent — check your inbox.');
        setSuccess(true);
      }
    } catch (err: any) {
      setMessage(err?.message || 'Error resending email.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Start countdown when Supabase throttle message appears.
  React.useEffect(() => {
    // clear any existing interval when message changes
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!message) {
      setRemainingSeconds(0);
      return;
    }

    const throttleMatch = message.match(/For security purposes[\s\S]*?(\d+)\s*seconds?/i);
    if (throttleMatch) {
      const parsed = parseInt(throttleMatch[1], 10) || 0;

      // compute elapsed time since the user clicked resend (if available)
      const lastAttempt = lastResendAttemptRef.current || Date.now();
      const elapsedSec = Math.floor((Date.now() - lastAttempt) / 1000);
      const initialRemaining = Math.max(parsed - elapsedSec, 0);
      setRemainingSeconds(initialRemaining);

      if (initialRemaining > 0) {
        intervalRef.current = window.setInterval(() => {
          setRemainingSeconds(prev => {
            if (prev <= 1) {
              if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              // clear message after countdown completes
              setMessage(null);
              return 0;
            }
            return prev - 1;
          });
        }, 1000) as unknown as number;
      }
    } else {
      // not a throttle message
      setRemainingSeconds(0);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [message]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    try {
      localStorage.removeItem('pendingRegistration');
      localStorage.removeItem('user_role');
    } catch (e) {
      // ignore localStorage errors in environments that don't support it
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <div className="p-10 bg-white rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                <span className="inline-flex w-9 h-9 bg-primary/10 rounded-md items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </span>
                <span>Verify your email</span>
              </h2>
              <p className="text-sm text-gray-600 mt-2">We sent a confirmation link to <span className="font-medium text-gray-800">{email || 'your email'}</span>. Click the link in the message to finish setting up your account.</p>

              <div className="mt-4" role="status" aria-live="polite">
                {message && (
                  <div className={`flex items-center gap-2 text-sm ${success ? 'text-green-600' : 'text-rose-600'}`}>
                    {success ? <CheckCircle className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                    <span>
                      {(() => {
                        if (message && remainingSeconds > 0) {
                          // replace the numeric seconds in the message with the live remainingSeconds
                          return message.replace(/(\d+)\s*seconds?/i, `${remainingSeconds} seconds`);
                        }
                        return message;
                      })()}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <CustomButton
                  text={loading ? 'Sending...' : 'Resend verification email'}
                  onClick={handleResend}
                  disabled={loading || remainingSeconds > 0}
                  className="w-full bg-primary text-white flex items-center justify-center gap-2"
                />

                <button
                  onClick={handleSignOut}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>

                <button
                  onClick={() => router.push('/login')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm text-primary hover:underline"
                >
                  Back to sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
