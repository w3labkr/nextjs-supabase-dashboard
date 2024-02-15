'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

import { AppBarContext } from '@/context/app-bar-provider'
import { LucideIcon } from '@/lib/lucide-icon'
import { cn } from '@/utils/tailwind'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TooltipLink } from '@/components/tooltip-link'

import {
  MiniDrawerItemProps,
  MiniDrawerGroupItemProps,
} from '@/types/dashboard'
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
        <LucideIcon name={siteConfig.symbol} className="size-5" />
        <span className="sr-only">{siteConfig.name}</span>
      </div>
      <nav className="flex-1 space-y-2 overflow-auto py-2">
        <MiniDrawerGroupItems items={dashboardConfig.miniDrawerGroupItems} />
      </nav>
    </div>
  )
}

function MiniDrawerGroupItems({
  items,
}: {
  items: MiniDrawerGroupItemProps[]
}) {
  const pathname = usePathname()

  return items.map((item) => (
    <React.Fragment key={item.id}>
      {item.separator && <Separator />}
      {item.label && (
        <span className="flex p-1 text-sm font-semibold text-muted-foreground">
          {item.label}
        </span>
      )}
      <MiniDrawerItems items={item.items} pathname={pathname} />
    </React.Fragment>
  ))
}

function MiniDrawerItems({
  items,
  pathname,
}: {
  items: MiniDrawerItemProps[]
  pathname: string
}) {
  return items.map((item) => (
    <TooltipLink
      key={item.id}
      href={item.href}
      title={item.title}
      className={cn(
        'relative flex justify-center rounded-lg p-1 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
        pathname.startsWith(item.href)
          ? 'text-gray-900 dark:text-gray-50'
          : 'text-gray-500'
      )}
      tooltipContent={{ side: 'right', align: 'end', alignOffset: 6 }}
    >
      {item.iconName && <LucideIcon name={item.iconName} className="size-5" />}
      {!!item.badge && (
        <Badge
          className="absolute bottom-0 right-0 justify-center px-1 py-0.5"
          style={{ fontSize: 10, lineHeight: 1 }}
        >
          {item.badge}
        </Badge>
      )}
    </TooltipLink>
  ))
}
