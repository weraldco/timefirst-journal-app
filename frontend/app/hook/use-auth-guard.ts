'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthGuardOptions {
  redirectIfAuthenticated?: boolean;
  redirectIfNotAuthenticated?: boolean;
  redirectPath?: string;
}

type AuthStatus =
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'offline';

export function useAuthGuard({
  redirectIfAuthenticated = false,
  redirectIfNotAuthenticated = false,
  redirectPath = '/',
}: AuthGuardOptions = {}) {
  const router = useRouter();

  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      // 🔴 Network check first
      if (!navigator.onLine) {
        if (isMounted) setStatus('offline');
        return;
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

    //   If offline then return none.
      if (!isMounted) return;

    //   If not loggedin return unauthenticated
      if (error) {
        setStatus('unauthenticated');
        setUser(null);
        return;
      }

    //   if logged in then return authenticated!
      if (session?.user) {
        setUser(session.user);
        setStatus('authenticated');

        
        if (redirectIfAuthenticated) {
          router.replace(redirectPath);
        }
        return;
      }

    //   Else false here, user is not logged in
      setUser(null);
      setStatus('unauthenticated');

    //   return to redirectPatth
      if (redirectIfNotAuthenticated) {
        router.replace(redirectPath);
      }
    };

    checkAuth();

    // 🔄 Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
        // If offline, then return nothing.
      if (!navigator.onLine) {
        setStatus('offline');
        return;
      }

      if (session?.user) {
        setUser(session.user);
        setStatus('authenticated');
      } else {
        setUser(null);
        setStatus('unauthenticated');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [
    router,
    redirectIfAuthenticated,
    redirectIfNotAuthenticated,
    redirectPath,
  ]);

  return {
    user,
    status,
    loading: status === 'loading',
  };
}
