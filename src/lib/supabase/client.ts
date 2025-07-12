import { createBrowserClient } from '@supabase/ssr'

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export function createClient() {
  const supabase = createBrowserClient(supabaseUrl, supabaseKey)
  return supabase
}

// Create a singleton client for better performance
let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export function getClient() {
  if (!clientInstance) {
    clientInstance = createClient()
  }
  return clientInstance
}

/**
 * Test the Supabase connection and configuration
 * @returns Promise<{ success: boolean; error?: string; details?: any }>
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; error?: string; details?: any }> {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Check environment variables
    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        error: 'Missing Supabase environment variables',
        details: {
          hasUrl: !!supabaseUrl,
          hasAnonKey: !!supabaseKey
        }
      };
    }
    
    const supabase = createClient();
    
    // Test basic connection by getting session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error);
      return {
        success: false,
        error: error.message,
        details: { error }
      };
    }
    
    console.log('✅ Supabase connection test successful');
    return {
      success: true,
      details: {
        hasSession: !!data.session,
        hasUser: !!data.session?.user
      }
    };
    
  } catch (err) {
    console.error('💥 Error testing Supabase connection:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      details: { err }
    };
  }
}