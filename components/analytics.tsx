import * as React from 'react'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'

const Analytics = () => {
  return process.env.NODE_ENV === 'production' ? <VercelAnalytics /> : null
}

export { Analytics }
