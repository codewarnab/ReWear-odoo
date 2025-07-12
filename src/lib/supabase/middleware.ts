import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('🔐 Middleware - User authentication check:', {
    hasUser: !!user,
    userId: user?.id,
    pathname: request.nextUrl.pathname
  })

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (user && request.nextUrl.pathname.startsWith('/login')) {
    console.log('🔄 Middleware - Authenticated user trying to access login, redirecting to dashboard')
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/api/auth')
  ) {
    console.log('🚫 Middleware - No user found, redirecting to Login')
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Check if user has a complete profile in the database
  let profileComplete = false;
  if (user) {
    try {
      const { data: profile, error } = await supabase
        .from('users_profiles')
        .select('id, full_name, username')
        .eq('id', user.id)
        .single();

      if (!error && profile && profile.full_name && profile.username) {
        profileComplete = true;
      }

      console.log('📊 Middleware - Profile check:', {
        hasProfile: !!profile,
        profileComplete,
        profileData: profile ? { 
          hasFullName: !!profile.full_name, 
          hasUsername: !!profile.username 
        } : null
      });
    } catch (error) {
      console.log('❌ Middleware - Error fetching profile:', error);
    }
  }

  if (user &&
    !profileComplete &&
    !request.nextUrl.pathname.startsWith('/get-started') &&
    !request.nextUrl.pathname.startsWith('/api/auth')
  ) {
    console.log('⚠️ Middleware - Profile incomplete, redirecting to Get Started')
    const url = request.nextUrl.clone()
    url.pathname = '/get-started'
    return NextResponse.redirect(url)
  }

  //console.log('✅ Middleware - User authenticated and profile complete, continuing to:', request.nextUrl.pathname)
  // If user is authenticated and profile is complete, continue with the request
  return supabaseResponse
}