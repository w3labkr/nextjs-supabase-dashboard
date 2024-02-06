'use client'

import * as React from 'react'

import { AppBarContext } from '@/context/app-bar-provider'
import { cn } from '@/utils/tailwind'
import { Notify } from '@/components/dashboard/notify'
import { AccountMenu } from '@/components/dashboard/account-menu'

export interface AppBarProps extends React.HTMLAttributes<HTMLElement> {}

export function AppBar({ children, ...props }: AppBarProps) {
  const appBarState = React.useContext(AppBarContext)

  return (
    <header
      className={cn(
        'flex items-center gap-4 border-b px-6',
        appBarState?.height ?? 'h-[50px]'
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
