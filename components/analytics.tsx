import { Analytics as VercelAnalytics } from '@vercel/analytics/react'

export function Analytics() {
  if (process.env.NODE_ENV !== 'production') return null

  return <VercelAnalytics />
}
