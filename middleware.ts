import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/supabase/middleware'
import { Deny, denies } from '@/config/middleware'

// Server Components only have read access to cookies.
// This Middleware example can be used to refresh expired sessions before loading Server Component routes.
export async function middleware(request: NextRequest) {
  const { response, authenticated } = await updateSession(request)

  const found = denies?.find((deny: Deny) =>
    request.nextUrl.pathname.startsWith(deny.source)
  )

  if (found && found.authenticated === authenticated) {
    return NextResponse.redirect(new URL(found.destination, request.url))
  }

  const url = new URL(request.url)
  response.headers.set('x-url', request.url)
  response.headers.set('x-origin', url.origin)
  response.headers.set('x-pathname', url.pathname)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
