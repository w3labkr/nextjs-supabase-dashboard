import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

let counter = 0

// Server Components only have read access to cookies.
// This Middleware example can be used to refresh expired sessions before loading Server Component routes.
export async function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    counter++
    console.log('middleware #:', counter)
  }

  return await updateSession(request)
}

export const config = {
  matcher: ['/', '/auth/:path*', '/dashboard/:path*'],
}
