'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { LucideIcon } from '@/lib/lucide-icon'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { TooltipLinkButton } from '@/components/tooltip-link-button'
import { useAppBar } from './app-bar'

import { siteConfig } from '@/config/site'
import { DashboardMiniNavItem, DashboardMiniNavSubItem } from '@/types/config'

export interface MiniNavigationProps
  extends React.HTMLAttributes<HTMLDivElement> {
  nav: DashboardMiniNavItem[]
  user_role?: string
}

export function MiniNavigation(props: MiniNavigationProps) {
  const { className, nav, user_role, ...rest } = props
  const { height } = useAppBar()

  return (
    <div
      className={cn(
        'flex flex-col border-r bg-background px-2',
        'w-14 min-w-14',
        className
      )}
      {...rest}
    >
      <div className={cn('flex items-center justify-center border-b', height)}>
        <Link href="/">
          <LucideIcon name={siteConfig.symbol} className="size-5 min-w-5" />
          <span className="sr-only">{siteConfig.name}</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 overflow-auto py-2">
        {nav?.map((item: DashboardMiniNavItem) => {
          const { id, roles } = item
          if (roles && user_role && !roles?.includes(user_role)) return null
          return <NavItem key={id} item={item} user_role={user_role} />
        })}
      </nav>
    </div>
  )
}

interface NavItemProps {
  item: DashboardMiniNavItem
  user_role?: string
}

function NavItem(props: NavItemProps) {
  const {
    item: { separator, items },
    user_role,
  } = props

  return (
    <React.Fragment>
      {separator && <Separator />}
      {items?.map((sub: DashboardMiniNavSubItem) => {
        const { id, roles } = sub
        if (roles && user_role && !roles?.includes(user_role)) return null
        return <NavSubItem key={id} item={sub} />
      })}
    </React.Fragment>
  )
}

interface NavSubItemProps {
  item: DashboardMiniNavSubItem
}

function NavSubItem(props: NavSubItemProps) {
  const {
    item: { href, iconName, title, translate, disabled, badge },
  } = props
  const pathname = usePathname()

  return (
    <TooltipLinkButton
      variant="ghost"
      href={href}
      className={cn(
        'relative flex h-auto justify-center rounded-lg px-2 py-0.5 transition-all',
        'text-gray-500 hover:bg-transparent hover:text-gray-900',
        'dark:text-gray-400 dark:hover:text-gray-50',
        pathname?.startsWith(href) ? 'text-gray-900 dark:text-gray-50' : ''
      )}
      startIconName={iconName}
      startIconClassName="size-5 min-w-5 mr-0"
      text={`DashboardNavigation.${title}`}
      translate={translate}
      tooltipContent={{ side: 'right', align: 'end', alignOffset: 6 }}
      disabled={disabled}
    >
      {!!badge && (
        <Badge
          className="absolute bottom-0 right-0 justify-center px-1 py-0.5"
          style={{ fontSize: 10, lineHeight: 1 }}
        >
          {badge}
        </Badge>
      )}
    </TooltipLinkButton>
  )
}
