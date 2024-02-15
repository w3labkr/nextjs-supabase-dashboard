import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/server'

let counter = 0

// Server Components only have read access to cookies.
// This Middleware example can be used to refresh expired sessions before loading Server Component routes.
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  })
  const pathname = request.nextUrl.pathname

  if (process.env.NODE_ENV !== 'production') {
    counter++
    console.log('middleware #:', counter)
    return response
  }

  const supabase = createMiddlewareClient(request, response)
  const { data, error } = await supabase.auth.getUser()
  const isAuthenticated = !(error || !data?.user)

  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/auth/reset-password')
  ) {
    if (!isAuthenticated)
      return NextResponse.redirect(new URL('/auth/signin', request.url))
  } else if (
    pathname.startsWith('/auth/signin') ||
    pathname.startsWith('/auth/signup')
  ) {
    if (isAuthenticated)
      return NextResponse.redirect(
        new URL('/dashboard/settings/profile', request.url)
      )
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}
