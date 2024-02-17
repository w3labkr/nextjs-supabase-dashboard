import * as React from 'react'

import { LucideIcon } from '@/lib/lucide-icon'
import { siteConfig } from '@/config/site'

import { MobileNavItems } from './mobile-nav-items'

export interface MobileNavigationProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function MobileNavigation({ ...props }: MobileNavigationProps) {
  return (
    <div className="grid w-full max-w-md gap-4" {...props}>
      <div className="flex items-center gap-4">
        <LucideIcon name={siteConfig.symbol} className="size-6" />
        <span>{siteConfig.name}</span>
      </div>
      <nav className="grid">
        <MobileNavItems items={siteConfig.mobileNavItems} />
      </nav>
    </div>
  )
}
