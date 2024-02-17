'use client'

import * as React from 'react'

import { AppBarContext } from '@/context/app-bar-provider'
import { cn } from '@/utils/tailwind'
import { Notify } from '@/components/dashboard/notify'
import { AccountMenu } from '@/components/dashboard/account-menu'

export interface AppBarProps extends React.HTMLAttributes<HTMLElement> {}

export function AppBar({ children, className, ...props }: AppBarProps) {
  const appBarState = React.useContext(AppBarContext)

  return (
    <header
      className={cn(
        'flex w-full items-center gap-4 border-b bg-background px-6',
        appBarState?.height ?? 'h-[50px]',
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
