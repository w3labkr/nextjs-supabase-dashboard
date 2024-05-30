'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { LinkButton } from '@/components/link-button'
import { useAppBar } from './app-bar'

import { DashboardNavItem, DashboardNavSubItem } from '@/types/config'

interface NavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  nav: DashboardNavItem[]
  user_role?: string
}

const Navigation = (props: NavigationProps) => {
  const { className, nav, user_role, title, translate, ...rest } = props
  const { height } = useAppBar()
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex flex-col border-r bg-background',
        'w-48 min-w-48 lg:w-64',
        className
      )}
      {...rest}
    >
      <div
        className={cn('flex flex-row items-center gap-2 border-b px-4', height)}
      >
        <span className="font-semibold">
          {title && translate === 'yes'
            ? t(`DashboardNavigation.${title}`)
            : title}
        </span>
      </div>
      <div className="flex-1 space-y-1 overflow-auto p-2">
        {nav?.map((item: DashboardNavItem) => {
          const { id, roles } = item
          if (roles && user_role && !roles?.includes(user_role)) return null
          return <NavItem key={id} item={item} user_role={user_role} />
        })}
      </div>
    </div>
  )
}

interface NavItemProps {
  item: DashboardNavItem
  user_role?: string
}

const NavItem = (props: NavItemProps) => {
  const {
    item: { separator, label, translate, items },
    user_role,
  } = props
  const { t } = useTranslation()

  return (
    <React.Fragment>
      {separator && <Separator className="!my-4" />}
      {label && (
        <span className="flex p-1 text-sm font-semibold text-muted-foreground">
          {label && translate === 'yes'
            ? t(`DashboardNavigation.${label}`)
            : label}
        </span>
      )}
      {items?.map((sub: DashboardNavSubItem) => {
        const { id, roles } = sub
        if (roles && user_role && !roles?.includes(user_role)) return null
        return <NavSubItem key={id} item={sub} />
      })}
    </React.Fragment>
  )
}

interface NavSubItemProps {
  item: DashboardNavSubItem
}

const NavSubItem = (props: NavSubItemProps) => {
  const {
    item: { href, iconName, title, translate, disabled },
  } = props
  const pathname = usePathname()

  return (
    <LinkButton
      variant="ghost"
      href={href}
      className={cn(
        'relative flex h-auto rounded px-1 py-0.5 text-sm transition-all',
        'text-gray-500 hover:bg-transparent hover:text-gray-900',
        'dark:text-gray-400 dark:hover:text-gray-50',
        pathname?.startsWith(href) ? 'text-gray-900 dark:text-gray-50' : ''
      )}
      startIconName={iconName}
      text={`DashboardNavigation.${title}`}
      translate={translate}
      disabled={disabled}
    />
  )
}

export { Navigation, type NavigationProps }
