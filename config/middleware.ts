import { AccessDenied } from '@/types/middleware'

export const accessDenied: AccessDenied[] = [
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
    to: '/dashboard/settings/profile',
    authenticated: true,
  },
  {
    from: '/auth/signup',
    to: '/dashboard/settings/profile',
    authenticated: true,
  },
]
