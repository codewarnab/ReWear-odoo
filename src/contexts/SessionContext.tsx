"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient, testSupabaseConnection } from '@/lib/supabase/client';
import { Tables } from '@/types/supabase';

// Type alias for user profile
type UserProfile = Tables<'users_profiles'>;

/**
 * Interface for the session context state
 */
interface SessionContextType {
  /** Current authenticated user from Supabase Auth */
  user: User | null;
  /** Current session from Supabase Auth */
  session: Session | null;
  /** User profile data from the database */
  userProfile: UserProfile | null;
  /** Loading state for initial authentication check */
  isLoading: boolean;
  /** Loading state for profile data fetch */
  isProfileLoading: boolean;
  /** Error state for authentication or profile fetch */
  error: string | null;
  /** Function to refresh user profile data */
  refreshProfile: () => Promise<void>;
  /** Function to sign out the user */
  signOut: () => Promise<void>;
  /** Function to check if user is authenticated */
  isAuthenticated: boolean;
  /** Function to check if user has completed their profile */
  hasCompleteProfile: boolean;
}

/**
 * Session Context - provides authentication state throughout the app
 */
const SessionContext = createContext<SessionContextType | undefined>(undefined);

/**
 * Props for the SessionProvider component
 */
interface SessionProviderProps {
  children: ReactNode;
}

/**
 * Session Provider component that manages authentication state
 * 
 * This component:
 * - Fetches and maintains current user session
 * - Fetches and maintains user profile data
 * - Provides authentication state to child components
 * - Handles session changes and profile updates
 * - Returns null JSX (only manages state)
 * 
 * @param props - The provider props containing children
 * @returns null - This component only manages state, doesn't render anything
 */
export function SessionProvider({ children }: SessionProviderProps) {
  // Authentication state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  /**
   * Fetches user profile data from the database
   * @param userId - The ID of the user to fetch profile for
   */
  const fetchUserProfile = async (userId: string): Promise<void> => {
    console.log('🔍 fetchUserProfile: Starting profile fetch for user:', userId);
    
    try {
      setIsProfileLoading(true);
      setError(null);

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000); // 10 second timeout
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
        // If profile doesn't exist, create a basic one
        if (profileError.code === 'PGRST116') {
          console.log('📝 Profile not found, user may need to complete onboarding');
          setUserProfile(null);
        } else {
          console.error('❌ Error fetching user profile:', profileError);
          setError('Failed to fetch user profile');
        }
      } else {
        console.log('✅ Profile fetched successfully:', profile);
        setUserProfile(profile);
      }
    } catch (err) {
      console.error('💥 Error in fetchUserProfile:', err);
      
      // Don't set error for timeout - just continue without profile
      if (err instanceof Error && err.message === 'Profile fetch timeout') {
        console.log('⏰ Profile fetch timed out, continuing without profile');
        setUserProfile(null);
      } else {
        setError('Failed to fetch user profile');
      }
    } finally {
      console.log('🏁 fetchUserProfile: Completed');
      setIsProfileLoading(false);
    }
  };

  /**
   * Refreshes the user profile data
   */
  const refreshProfile = async (): Promise<void> => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  /**
   * Signs out the current user
   */
  const signOut = async (): Promise<void> => {
    try {
      setError(null);
      await supabase.auth.signOut();
      // State will be updated by the auth state change listener
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out');
    }
  };

  /**
   * Checks if user is authenticated
   */
  const isAuthenticated = !!user;

  /**
   * Checks if user has completed their profile
   */
  const hasCompleteProfile = !!(
    userProfile && 
    userProfile.full_name && 
    userProfile.username
  );

  // Set up auth state change listener
  useEffect(() => {
    let mounted = true;

    // Validate environment variables
    const validateConfig = () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ Missing Supabase environment variables:', {
          hasUrl: !!supabaseUrl,
          hasAnonKey: !!supabaseAnonKey
        });
        return false;
      }
      
      console.log('✅ Supabase environment variables configured');
      return true;
    };

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🚀 Getting initial session...');
        
        // Validate configuration first
        if (!validateConfig()) {
          if (mounted) {
            setError('Supabase configuration missing');
            setIsLoading(false);
          }
          return;
        }
        
        // Add timeout to prevent hanging on session fetch
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Session fetch timeout')), 15000); // 15 second timeout
        });

        const sessionPromise = supabase.auth.getSession();

        const { data: { session: initialSession }, error: sessionError } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;

        console.log('📊 Initial session result:', { 
          hasSession: !!initialSession, 
          hasUser: !!initialSession?.user,
          error: sessionError?.message 
        });
        
        if (sessionError) {
          console.error('❌ Error getting initial session:', sessionError);
          setError('Failed to get session');
        } else if (mounted) {
          console.log('✅ Setting session and user:', { hasSession: !!initialSession, hasUser: !!initialSession?.user });
          setSession(initialSession);
          setUser(initialSession?.user || null);
          
          // Fetch profile if user is authenticated
          if (initialSession?.user) {
            console.log('👤 Fetching profile for user:', initialSession.user.id);
            await fetchUserProfile(initialSession.user.id);
          } else {
            console.log('👤 No user found, skipping profile fetch');
          }
        }
      } catch (err) {
        console.error('💥 Error in getInitialSession:', err);
        if (mounted) {
          // Don't set error for timeout - just continue without session
          if (err instanceof Error && err.message === 'Session fetch timeout') {
            console.log('⏰ Session fetch timed out, continuing without session');
            setSession(null);
            setUser(null);
            setUserProfile(null);
          } else {
            setError('Failed to initialize session');
          }
        }
      } finally {
        if (mounted) {
          console.log('🏁 Setting isLoading to false');
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
      
      // Only fetch profile for actual sign-in events, not initial load
      if (event === 'SIGNED_IN' && newSession?.user) {
        console.log('👤 User signed in, fetching profile for:', newSession.user.id);
        await fetchUserProfile(newSession.user.id);
      } else if (event === 'SIGNED_OUT' || !newSession?.user) {
        // User signed out, clear profile
        console.log('👤 User signed out, clearing profile');
        setUserProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Context value
  const contextValue: SessionContextType = {
    user,
    session,
    userProfile,
    isLoading,
    isProfileLoading,
    error,
    refreshProfile,
    signOut,
    isAuthenticated,
    hasCompleteProfile,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

/**
 * Custom hook to use the session context
 * 
 * @returns SessionContextType - The session context value
 * @throws Error if used outside of SessionProvider
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { user, userProfile, isLoading, signOut } = useSession();
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   if (!user) return <div>Please sign in</div>;
 *   
 *   return (
 *     <div>
 *       <h1>Welcome, {userProfile?.full_name}!</h1>
 *       <button onClick={signOut}>Sign Out</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  
  return context;
}

/**
 * Hook to check if user is authenticated (shorthand)
 * 
 * @returns boolean - Whether user is authenticated
 * 
 * @example
 * ```typescript
 * function ProtectedComponent() {
 *   const isAuthenticated = useAuth();
 *   
 *   if (!isAuthenticated) {
 *     return <div>Access denied</div>;
 *   }
 *   
 *   return <div>Protected content</div>;
 * }
 * ```
 */
export function useAuth(): boolean {
  const { isAuthenticated } = useSession();
  return isAuthenticated;
}

/**
 * Hook to get current user (shorthand)
 * 
 * @returns User | null - Current authenticated user
 * 
 * @example
 * ```typescript
 * function UserInfo() {
 *   const user = useUser();
 *   
 *   if (!user) return null;
 *   
 *   return <div>User: {user.email}</div>;
 * }
 * ```
 */
export function useUser(): User | null {
  const { user } = useSession();
  return user;
}

/**
 * Hook to get current user profile (shorthand)
 * 
 * @returns UserProfile | null - Current user profile
 * 
 * @example
 * ```typescript
 * function ProfileInfo() {
 *   const profile = useUserProfile();
 *   
 *   if (!profile) return <div>No profile found</div>;
 *   
 *   return <div>Welcome, {profile.full_name}!</div>;
 * }
 * ```
 */
export function useUserProfile(): UserProfile | null {
  const { userProfile } = useSession();
  return userProfile;
} 