'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Notify } from '@/components/notify'
import { AccountMenu } from '@/components/account-menu'

import { useAppBar } from './app-bar-provider'

interface AppBarProps extends React.HTMLAttributes<HTMLElement> {}

const AppBar = (props: AppBarProps) => {
  const { children, className, ...rest } = props
  const { height } = useAppBar()

  return (
    <header
      className={cn(
        'flex w-full items-center gap-4 border-b bg-background px-6',
        height,
        className
      )}
      {...rest}
    >
      {children}
      <div className="flex-1"></div>
      <Notify />
      <AccountMenu />
    </header>
  )
}

export { AppBar, type AppBarProps }
