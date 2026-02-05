import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/signin',
  '/signup',
  '/auth',
  '/auth/login',
  '/auth/signup',
  '/builders',
  '/projects',
  '/feed', // Feed is viewable without auth, but posting requires it
  '/jobs',
  '/endorsements',
  '/learn',
]

// Paths that start with these prefixes are always allowed
const publicPrefixes = [
  '/api/',
  '/_next/',
  '/favicon',
  '/public',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow all API routes and static files
  if (publicPrefixes.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // Allow exact public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Allow dynamic public routes like /builders/[id], /projects/[id]
  if (pathname.startsWith('/builders/') || pathname.startsWith('/projects/')) {
    return NextResponse.next()
  }

  // For protected routes, check for session
  // Note: We're using localStorage on client side, so we can't check here
  // Instead, we'll let the client-side handle auth state
  // This middleware primarily handles the redirect logic structure

  // Check for session cookie (if using cookies for auth)
  const sessionCookie = request.cookies.get('devpump_session')

  // If no session and trying to access protected route, redirect to signin
  // For now, we allow access and let client-side handle auth
  // This can be enhanced when server-side sessions are implemented

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
