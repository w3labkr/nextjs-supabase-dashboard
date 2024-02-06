import * as React from 'react'

import { LucideIcon } from '@/lib/lucide-icon'
import { cn } from '@/utils/tailwind'

export interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <LucideIcon name="Command" className={cn('mx-auto size-6', className)} />
  )
}
