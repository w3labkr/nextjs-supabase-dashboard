'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { AppBarContext } from '@/components/app-bar/app-bar-provider'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { LinkButton } from '@/components/link-button'

import { DrawerGroupProps, DrawerItemProps } from '@/types/dashboard'

export interface PersistentDrawerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  groups: DrawerGroupProps[]
}

export function PersistentDrawer({
  className,
  title,
  groups,
  translate,
  ...props
}: PersistentDrawerProps) {
  const appBarState = React.useContext(AppBarContext)
  const { t } = useTranslation()
  const pathname = usePathname()

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
          appBarState?.height ?? 'h-[50px]'
        )}
      >
        <span className="font-semibold">
          {title && translate === 'yes'
            ? t(`DashboardNavigation.${title}`)
            : title}
        </span>
      </div>
      <div className="flex-1 space-y-1 overflow-auto p-2">
        {groups?.map((group) => (
          <DrawerGroup key={group?.id} group={group} pathname={pathname} />
        ))}
      </div>
    </div>
  )
}

export function DrawerGroup({
  group,
  pathname,
}: {
  group: DrawerGroupProps
  pathname: string
}) {
  const { t } = useTranslation()

  return (
    <React.Fragment>
      {group?.separator && <Separator className="!my-4" />}
      {group?.label && (
        <span className="flex p-1 text-sm font-semibold text-muted-foreground">
          {group?.label && group?.translate === 'yes'
            ? t(`DashboardNavigation.${group?.label}`)
            : group?.label}
        </span>
      )}
      {group?.items?.map((item) => (
        <DrawerItem key={item?.id} item={item} pathname={pathname} />
      ))}
    </React.Fragment>
  )
}

export function DrawerItem({
  item,
  pathname,
}: {
  item: DrawerItemProps
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
