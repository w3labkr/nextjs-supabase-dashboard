import * as React from 'react'
import Link from 'next/link'

import { LucideIcon } from '@/lib/lucide-icon'
import { siteConfig } from '@/config/site'
import { absoluteUrl } from '@/lib/utils'

const SiteBrand = ({ className }: { className?: string }) => {
  return (
    <Link className={className} href={absoluteUrl('/')}>
      <LucideIcon name={siteConfig?.symbol} size={20} />
      <span className="sr-only">{siteConfig?.name}</span>
    </Link>
  )
}

export { SiteBrand }
