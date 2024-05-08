import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { accessDenied } from '@/config/middleware'

// Server Components only have read access to cookies.
// This Middleware example can be used to refresh expired sessions before loading Server Component routes.
export async function middleware(request: NextRequest) {
  const { response, isAuthenticated } = await updateSession(request)

  const denied = accessDenied.filter((deny) => {
    if (!request.nextUrl.pathname.startsWith(deny.from)) return
    if (isAuthenticated !== deny?.isAuthenticated) return
    return deny
  })[0]

  if (denied) {
    return NextResponse.redirect(new URL(denied.to, request.url))
  }

  return response
}

export const config = {
  matcher: ['/', '/auth/:path*', '/dashboard/:path*'],
}
