import * as React from 'react'
import Link from 'next/link'

import { LucideIcon } from '@/lib/lucide-icon'
import { siteConfig } from '@/config/site'

const BackLink = () => {
  return (
    <Link
      href="/dashboard/posts"
      scroll={!siteConfig?.fixedHeader}
      className="hover:text-muted-foreground"
    >
      <LucideIcon name="ChevronLeft" size={24} />
    </Link>
  )
}

export { BackLink }
