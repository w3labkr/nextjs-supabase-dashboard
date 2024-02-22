'use client'

import * as React from 'react'

import { AppBarContext } from '@/components/app-bar/app-bar-provider'
import { cn } from '@/lib/utils'
import { LucideIcon } from '@/lib/lucide-icon'

import { MiniDrawerGroupItems } from './mini-drawer-group-items'

import { siteConfig } from '@/config/site'
import { dashboardConfig } from '@/config/dashboard'

export interface MiniDrawerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MiniDrawer({ className, ...props }: MiniDrawerProps) {
  const appBarState = React.useContext(AppBarContext)

  return (
    <div
      className={cn(
        'flex flex-col border-r bg-background px-2',
        'w-14 min-w-14',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'flex items-center justify-center border-b',
          appBarState?.height ?? 'h-[50px]'
        )}
      >
        <LucideIcon name={siteConfig.symbol} className="size-5 min-w-5" />
        <span className="sr-only">{siteConfig.name}</span>
      </div>
      <nav className="flex-1 space-y-2 overflow-auto py-2">
        <MiniDrawerGroupItems items={dashboardConfig.miniDrawerGroupItems} />
      </nav>
    </div>
  )
}
