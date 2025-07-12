import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createserverClient } from '@/lib/supabase/server'

// Creating a handler for a GET request to route /auth/callback
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null


  //console.log('🔗 Auth callback received:', request.url, 
  //  '📋 Callback parameters:', {
  //  code: code ? 'present' : 'missing',
  //  token_hash: token_hash ? 'present' : 'missing',
  //  type: type ? 'present' : 'missing',
  //})

  const supabase = await createserverClient()
  const next = '/home'

  // Create redirect link without the secret parameters
  const redirectTo = new URL(next, request.url)
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')
  redirectTo.searchParams.delete('code')

  // Handle OTP verification
  if (token_hash && type) {
    console.log('🔑 Attempting OTP verification for type:', type)
    
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error) {
      console.log('✅ OTP verification successful')
      redirectTo.searchParams.delete('next')
      return NextResponse.redirect(redirectTo)
    } else {
      console.log('❌ OTP verification failed:', error.message)
    }
  }

  // Handle authorization code exchange
  if (code) {
    console.log('🔄 Attempting code exchange for session')
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      console.log('✅ Code exchange successful, redirecting to Home')
      redirectTo.searchParams.delete('next')
      return NextResponse.redirect(redirectTo)
    } else {
      console.log('❌ Code exchange failed:', error?.message || 'Unknown error')
    }
  }

  // If we reach here, something went wrong
  console.log('❌ Authentication failed, redirecting to error page')
  redirectTo.pathname = '/error'
  return NextResponse.redirect(redirectTo)
}
