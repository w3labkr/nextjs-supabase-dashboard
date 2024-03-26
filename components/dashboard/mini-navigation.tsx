'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { AppBarContext } from '@/components/app-bar/app-bar-provider'
import { cn } from '@/lib/utils'
import { LucideIcon } from '@/lib/lucide-icon'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { TooltipLinkButton } from '@/components/tooltip-link-button'

import { siteConfig } from '@/config/site'
import { dashboardConfig } from '@/config/dashboard'
import {
  DashboardMiniNavItem,
  DashboardMiniNavSubItem,
} from '@/types/dashboard'

export interface MiniNavigationProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function MiniNavigation({ className, ...props }: MiniNavigationProps) {
  const state = React.useContext(AppBarContext)
  const pathname = usePathname()

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
          state?.height
        )}
      >
        <Link href="/">
          <LucideIcon name={siteConfig.symbol} className="size-5 min-w-5" />
          <span className="sr-only">{siteConfig.name}</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 overflow-auto py-2">
        {dashboardConfig?.nav?.map((item) => (
          <NavItem key={item?.id} item={item} pathname={pathname} />
        ))}
      </nav>
    </div>
  )
}

function NavItem({
  item,
  pathname,
}: {
  item: DashboardMiniNavItem
  pathname: string
}) {
  return (
    <React.Fragment>
      {item?.separator && <Separator />}
      {item?.items?.map((sub) => (
        <NavSubItem key={sub?.id} item={sub} pathname={pathname} />
      ))}
    </React.Fragment>
  )
}

function NavSubItem({
  item,
  pathname,
}: {
  item: DashboardMiniNavSubItem
  pathname: string
}) {
  return (
    <TooltipLinkButton
      variant="ghost"
      href={item?.href}
      className={cn(
        'relative flex h-auto justify-center rounded-lg px-2 py-0.5 transition-all',
        'text-gray-500 hover:bg-transparent hover:text-gray-900',
        'dark:text-gray-400 dark:hover:text-gray-50',
        pathname.startsWith(item?.href) ? 'text-gray-900 dark:text-gray-50' : ''
      )}
      startIconName={item?.iconName}
      startIconClassName="size-5 min-w-5 mr-0"
      text={`DashboardNavigation.${item?.title}`}
      translate={item?.translate}
      tooltipContent={{ side: 'right', align: 'end', alignOffset: 6 }}
      disabled={item?.disabled}
    >
      {!!item?.badge && (
        <Badge
          className="absolute bottom-0 right-0 justify-center px-1 py-0.5"
          style={{ fontSize: 10, lineHeight: 1 }}
        >
          {item?.badge}
        </Badge>
      )}
    </TooltipLinkButton>
  )
}
