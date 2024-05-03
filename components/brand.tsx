import * as React from 'react'
import Link from 'next/link'

import { LucideIcon } from '@/lib/lucide-icon'
import { siteConfig } from '@/config/site'

const Brand = () => {
  return (
    <Link className="mr-6 hidden lg:flex" href="/">
      <LucideIcon name={siteConfig.symbol} className="size-6 min-w-6" />
      <span className="sr-only">{siteConfig.name}</span>
    </Link>
  )
}

export { Brand }
