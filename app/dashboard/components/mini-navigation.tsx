'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { useAppBar } from './app-bar'

import { LucideIcon, LucideIconName } from '@/lib/lucide-icon'
import { siteConfig } from '@/config/site'
import { DashboardMiniNavItem, DashboardMiniNavSubItem } from '@/types/config'

interface MiniNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  nav: DashboardMiniNavItem[]
  user_role?: string
}

const MiniNavigation = ({
  className,
  nav,
  user_role,
  ...props
}: MiniNavigationProps) => {
  const { height } = useAppBar()

  return (
    <div
      className={cn(
        'flex flex-col border-r bg-background px-2',
        'w-14 min-w-14',
        className
      )}
      {...props}
    >
      <div className={cn('flex items-center justify-center border-b', height)}>
        <Link href="/" scroll={!siteConfig?.fixedHeader}>
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

const NavItem = ({ item, user_role }: NavItemProps) => {
  const { separator, items } = item

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

const NavSubItem = ({ item }: NavSubItemProps) => {
  const { href, iconName, title, translate, disabled, badge } = item
  const router = useRouter()
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Button
              variant="ghost"
              className={cn(
                'relative flex h-auto justify-center rounded-lg px-2 py-0.5 transition-all',
                'text-gray-500 hover:bg-transparent hover:text-gray-900',
                'dark:text-gray-400 dark:hover:text-gray-50',
                pathname?.startsWith(href)
                  ? 'text-gray-900 dark:text-gray-50'
                  : ''
              )}
              onClick={() =>
                router.push(href, { scroll: !siteConfig?.fixedHeader })
              }
              disabled={disabled}
            >
              {iconName ? <TooltipIcon name={iconName} /> : null}
              {badge && badge > 0 ? <TooltipBadge badge={badge} /> : null}
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" align="end" alignOffset={6}>
          {title ? <TooltipTitle title={title} translate={translate} /> : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface TooltipTitleProps {
  title: string
  translate?: 'yes' | 'no'
}

const TooltipTitle = ({ title, translate }: TooltipTitleProps) => {
  const { t } = useTranslation()

  return translate === 'yes' ? t(`DashboardNavigation.${title}`) : title
}

interface TooltipIconProps {
  name: LucideIconName
}

const TooltipIcon = ({ name }: TooltipIconProps) => {
  return <LucideIcon name={name} className="mr-0 size-5 min-w-5" />
}

interface TooltipBadgeProps {
  badge: number
}

const TooltipBadge = ({ badge }: TooltipBadgeProps) => {
  return (
    <Badge
      className="absolute bottom-0 right-0 justify-center px-1 py-0.5"
      style={{ fontSize: 10, lineHeight: 1 }}
    >
      {badge}
    </Badge>
  )
}

export { MiniNavigation, type MiniNavigationProps }
