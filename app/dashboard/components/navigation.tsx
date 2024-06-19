'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useAppBar } from './app-bar'

import { LucideIcon } from '@/lib/lucide-icon'
import { DashboardNavItem, DashboardNavSubItem } from '@/types/config'
import { siteConfig } from '@/config/site'

interface NavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  nav: DashboardNavItem[]
  user_role?: string
  title: string
}

const Navigation = ({
  className,
  nav,
  user_role,
  title,
  translate,
  ...props
}: NavigationProps) => {
  const { height } = useAppBar()
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex flex-col border-r bg-background',
        'w-48 min-w-48 lg:w-64',
        className
      )}
      {...props}
    >
      <div
        className={cn('flex flex-row items-center gap-2 border-b px-4', height)}
      >
        <span className="font-semibold">
          {title && translate === 'yes' ? t(title) : title}
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

const NavItem = ({ item, user_role }: NavItemProps) => {
  const { separator, label, translate, items } = item
  const { t } = useTranslation()

  return (
    <React.Fragment>
      {separator && <Separator className="!my-4" />}
      {label && (
        <span className="flex p-1 text-sm font-semibold text-muted-foreground">
          {label && translate === 'yes' ? t(label) : label}
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

const NavSubItem = ({ item }: NavSubItemProps) => {
  const { href, iconName, title, translate, disabled } = item
  const { t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      className={cn(
        'relative flex h-auto rounded px-1 py-0.5 text-sm transition-all',
        'text-gray-500 hover:bg-transparent hover:text-gray-900',
        'dark:text-gray-400 dark:hover:text-gray-50',
        pathname?.startsWith(href) ? 'text-gray-900 dark:text-gray-50' : ''
      )}
      translate={translate}
      disabled={disabled}
      onClick={() => router.push(href, { scroll: !siteConfig?.fixedHeader })}
    >
      {iconName ? (
        <LucideIcon name={iconName} className="mr-2 size-4 min-w-4" />
      ) : null}
      {title && translate === 'yes' ? t(title) : title}
    </Button>
  )
}

export { Navigation, type NavigationProps }
