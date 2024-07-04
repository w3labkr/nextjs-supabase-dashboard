'use client'

import * as React from 'react'

import { AccountMenu } from '@/components/account-menu'
import { SiteBrand } from '@/components/site-brand'
import { Notify } from '@/app/dashboard/components/notify'

import { cn } from '@/lib/utils'

interface AppBarProps extends React.HTMLAttributes<HTMLElement> {}

const AppBar = ({ children, className, ...props }: AppBarProps) => {
  return (
    <header
      className={cn(
        'flex w-full items-center gap-4 border-b bg-background px-4',
        'h-[60px]',
        className
      )}
      {...props}
    >
      <SiteBrand />
      {children}
      <div className="flex-1 text-destructive"></div>
      <Notify />
      <AccountMenu />
    </header>
  )
}

export { AppBar, type AppBarProps }
