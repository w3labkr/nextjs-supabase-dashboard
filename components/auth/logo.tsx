import * as React from 'react'
import { LuCommand } from 'react-icons/lu'
import { cn } from '@/utils'

export interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return <LuCommand className={cn('mx-auto h-6 w-6', className)} />
}
