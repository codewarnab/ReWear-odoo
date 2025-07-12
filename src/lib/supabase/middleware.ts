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
    pathname: request.nextUrl.pathname,
    profileComplete: user?.app_metadata?.profile_complete
  })

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/SignIn') &&
    !request.nextUrl.pathname.startsWith('/api/auth')
  ) {
    console.log('🚫 Middleware - No user found, redirecting to SignIn')
    const url = request.nextUrl.clone()
    url.pathname = '/SignIn'
    return NextResponse.redirect(url)
  }

  const profileComplete = user?.app_metadata?.profile_complete;
  

  if (user &&
    !profileComplete &&
    !request.nextUrl.pathname.startsWith('/home') &&
    !request.nextUrl.pathname.startsWith('/api/complete-home')
  ) {
    console.log('⚠️ Middleware - Profile incomplete, redirecting to home')
    const url = request.nextUrl.clone()
    url.pathname = '/home'
    return NextResponse.redirect(url)
  }

  console.log('✅ Middleware - User authenticated and profile complete, continuing to:', request.nextUrl.pathname)
  // If user is authenticated and profile is complete, continue with the request
  return supabaseResponse
}