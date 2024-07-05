import * as React from 'react'
import Link from 'next/link'

import { LucideIcon } from '@/lib/lucide-icon'
import { siteConfig } from '@/config/site'
import { absoluteUrl } from '@/lib/utils'

const SiteBrand = ({ className }: { className?: string }) => {
  return (
    <Link className={className} href={absoluteUrl('/')}>
      <LucideIcon name={siteConfig?.symbol} className="size-5 min-w-5" />
      <span className="sr-only">{siteConfig?.name}</span>
    </Link>
  )
}

export { SiteBrand }
