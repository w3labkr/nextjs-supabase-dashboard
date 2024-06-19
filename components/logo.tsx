import * as React from 'react'

import { LucideIcon } from '@/lib/lucide-icon'
import { cn } from '@/lib/utils'

import { siteConfig } from '@/config/site'

interface LogoProps {
  className?: string
}

const Logo = ({ className }: LogoProps) => {
  return (
    <LucideIcon
      name={siteConfig.symbol}
      size={24}
      className={cn('mx-auto', className)}
    />
  )
}

export { Logo, type LogoProps }
