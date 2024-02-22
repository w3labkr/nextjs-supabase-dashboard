import * as React from 'react'

import { LucideIcon } from '@/lib/lucide-icon'
import { cn } from '@/lib/utils'

import { siteConfig } from '@/config/site'

export interface LogoProps {
  className?: string | undefined
}

export function Logo({ className }: LogoProps) {
  return (
    <LucideIcon
      name={siteConfig.symbol}
      className={cn('mx-auto size-6 min-w-6', className)}
    />
  )
}
