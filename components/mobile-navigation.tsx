import * as React from 'react'
import Link from 'next/link'

import { absoluteUrl, cn } from '@/lib/utils'
import { LucideIcon } from '@/lib/lucide-icon'
import { siteConfig } from '@/config/site'

const MobileNavigation = () => {
  return (
    <div className="grid w-full max-w-md gap-4">
      <div className="flex items-center gap-4">
        <LucideIcon name={siteConfig?.symbol} className="size-5 min-w-5" />
        <span>{siteConfig?.title}</span>
      </div>
      <nav className="grid gap-2 text-sm">
        <Link href={absoluteUrl('/')}>Home</Link>
        <Link href={absoluteUrl('/posts')}>Posts</Link>
      </nav>
    </div>
  )
}

export { MobileNavigation }
