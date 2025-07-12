import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - fonts (font files)
     * - Root path (/) by $/
     * - /terms, /privacy, /error
     * - manifest.json (PWA manifest)
     * Feel free to modify this pattern to include more paths. 
    */
    '/((?!_next/static|_next/image|favicon.ico|public|sitemap.xml|robots.txt|fonts|manifest.json|$|terms|privacy|error|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}