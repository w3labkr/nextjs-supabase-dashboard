'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Notify } from '@/components/notify'
import { AccountMenu } from '@/components/account-menu'

import { AppBarContext } from './app-bar-provider'

export interface AppBarProps extends React.HTMLAttributes<HTMLElement> {}

export function AppBar({ children, className, ...props }: AppBarProps) {
  const state = React.useContext(AppBarContext)

  return (
    <header
      className={cn(
        'flex w-full items-center gap-4 border-b bg-background px-6',
        state?.height,
        className
      )}
      {...props}
    >
      {children}
      <div className="flex-1"></div>
      <Notify />
      <AccountMenu />
    </header>
  )
}
