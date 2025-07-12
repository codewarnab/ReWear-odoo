"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tables } from '@/types/supabase';
import { useAuth } from './use-auth';

type UserProfile = Tables<'users_profiles'>;

export function useUserProfile() {
  const { user, isLoading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchUserProfile = async (userId: string): Promise<void> => {
    console.log('🔍 fetchUserProfile: Starting profile fetch for user:', userId);
    
    try {
      setIsLoading(true);
      setError(null);

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000);
      });

      const fetchPromise = supabase
        .from('users_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('🔍 fetchUserProfile: Executing database query...');
      
      const { data: profile, error: profileError } = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]) as any;

      console.log('🔍 fetchUserProfile: Query completed', { 
        hasProfile: !!profile, 
        hasError: !!profileError,
        errorCode: profileError?.code 
      });

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // No profile found - this is expected for new users
          console.log('No profile found for user, this is expected for new users');
          setUserProfile(null);
        } else {
          console.error('Database error fetching profile:', profileError);
          setError(`Failed to fetch profile: ${profileError.message}`);
        }
      } else {
        console.log('✅ Profile fetched successfully');
        setUserProfile(profile);
      }
    } catch (err) {
      console.error('💥 Error in fetchUserProfile:', err);
      
      // Don't set error for timeout - just continue without profile
      if (err instanceof Error && err.message === 'Profile fetch timeout') {
        console.log('Profile fetch timed out, continuing without profile');
        setUserProfile(null);
      } else {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      }
    } finally {
      console.log('🏁 fetchUserProfile: Completed');
      setIsLoading(false);
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.id) {
      fetchUserProfile(user.id);
    } else if (!authLoading && !user) {
      setUserProfile(null);
      setIsLoading(false);
    }
  }, [user?.id, authLoading]);

  const hasCompleteProfile = !!(
    userProfile && 
    userProfile.full_name && 
    userProfile.username
  );

  return {
    userProfile,
    isLoading: isLoading || authLoading,
    error,
    refreshProfile,
    hasCompleteProfile,
  };
}
