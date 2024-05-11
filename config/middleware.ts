import { MiddlewareAccessDenied } from '@/types/config'

// Make sure the new route is registered in the middleware.
// The default registered router routes are as follows:
// ['/', '/auth/:path*', '/dashboard/:path*']

export const accessDenied: MiddlewareAccessDenied[] = [
  {
    from: '/dashboard',
    to: '/auth/signin',
    authenticated: false,
  },
  {
    from: '/auth/reset-password',
    to: '/auth/signin',
    authenticated: false,
  },
  {
    from: '/api/v1',
    to: '/auth/signin',
    authenticated: false,
  },
  {
    from: '/auth/signin',
    to: '/dashboard',
    authenticated: true,
  },
  {
    from: '/auth/signup',
    to: '/dashboard',
    authenticated: true,
  },
]
