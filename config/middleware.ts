// Make sure the new route is registered in the middleware.
// The default registered router routes are as follows:
// ['/', '/auth/:path*', '/dashboard/:path*']
export interface Deny {
  source: string
  destination: string
  authenticated: boolean
}

export const denies: Deny[] = [
  {
    source: '/dashboard',
    destination: '/auth/signin',
    authenticated: false,
  },
  {
    source: '/auth/reset-password',
    destination: '/auth/signin',
    authenticated: false,
  },
  {
    source: '/auth/blocked',
    destination: '/auth/signin',
    authenticated: false,
  },
  {
    source: '/api/v1',
    destination: '/auth/signin',
    authenticated: false,
  },
  {
    source: '/auth/signin',
    destination: '/dashboard',
    authenticated: true,
  },
  {
    source: '/auth/signup',
    destination: '/dashboard',
    authenticated: true,
  },
]
