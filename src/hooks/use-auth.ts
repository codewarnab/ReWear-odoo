"use client";

import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          setError(error.message);
        } else {
          if (mounted) {
            setSession(session);
            setUser(session?.user || null);
          }
        }
      } catch (err) {
        console.error('Error in getInitialSession:', err);
        if (mounted) {
          setError('Failed to get session');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      console.log('🔄 Auth state changed:', event, {
        hasSession: !!newSession,
        hasUser: !!newSession?.user,
        userId: newSession?.user?.id
      });
      
      setSession(newSession);
      setUser(newSession?.user || null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out');
    }
  };

  return {
    user,
    session,
    isLoading,
    error,
    signOut,
    isAuthenticated: !!user,
  };
}
