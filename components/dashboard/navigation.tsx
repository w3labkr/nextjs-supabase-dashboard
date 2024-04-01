'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { AppBarContext } from '@/components/app-bar/app-bar-provider'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { LinkButton } from '@/components/link-button'

import { DashboardNavItem, DashboardNavSubItem } from '@/types/config'

export interface NavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  nav: DashboardNavItem[]
}

export function Navigation({
  className,
  title,
  nav,
  translate,
  ...props
}: NavigationProps) {
  const state = React.useContext(AppBarContext)
  const pathname = usePathname()
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
        className={cn(
          'flex flex-row items-center gap-2 border-b px-4',
          state?.height
        )}
      >
        <span className="font-semibold">
          {title && translate === 'yes'
            ? t(`DashboardNavigation.${title}`)
            : title}
        </span>
      </div>
      <div className="flex-1 space-y-1 overflow-auto p-2">
        {nav?.map((item) => {
          return item?.roles && !item?.roles?.includes(state?.role) ? null : (
            <NavItem key={item?.id} item={item} pathname={pathname} />
          )
        })}
      </div>
    </div>
  )
}

function NavItem({
  item,
  pathname,
}: {
  item: DashboardNavItem
  pathname: string
}) {
  const state = React.useContext(AppBarContext)
  const { t } = useTranslation()

  return (
    <React.Fragment>
      {item?.separator && <Separator className="!my-4" />}
      {item?.label && (
        <span className="flex p-1 text-sm font-semibold text-muted-foreground">
          {item?.label && item?.translate === 'yes'
            ? t(`DashboardNavigation.${item?.label}`)
            : item?.label}
        </span>
      )}
      {item?.items?.map((value) => {
        return value?.roles && !value?.roles?.includes(state?.role) ? null : (
          <NavSubItem key={value?.id} item={value} pathname={pathname} />
        )
      })}
    </React.Fragment>
  )
}

function NavSubItem({
  item,
  pathname,
}: {
  item: DashboardNavSubItem
  pathname: string
}) {
  return (
    <LinkButton
      variant="ghost"
      href={item?.href}
      className={cn(
        'relative flex h-auto rounded px-1 py-0.5 text-sm transition-all',
        'text-gray-500 hover:bg-transparent hover:text-gray-900',
        'dark:text-gray-400 dark:hover:text-gray-50',
        pathname.startsWith(item?.href) ? 'text-gray-900 dark:text-gray-50' : ''
      )}
      startIconName={item?.iconName}
      text={`DashboardNavigation.${item?.title}`}
      translate={item?.translate}
      disabled={item?.disabled}
    />
  )
}
