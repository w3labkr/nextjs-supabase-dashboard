import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/server'

let counter = 0

// Server Components only have read access to cookies.
// This Middleware example can be used to refresh expired sessions before loading Server Component routes.
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  if (process.env.NODE_ENV === 'production') {
    const supabase = createMiddlewareClient(request, response)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  } else {
    counter++
    console.log('middleware #:', counter)
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
