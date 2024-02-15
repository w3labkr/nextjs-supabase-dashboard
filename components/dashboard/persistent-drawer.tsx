'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { AppBarContext } from '@/context/app-bar-provider'
import { LucideIcon } from '@/lib/lucide-icon'
import { cn } from '@/utils/tailwind'
import { Separator } from '@/components/ui/separator'

import { DrawerGroupItemProps, DrawerItemProps } from '@/types/dashboard'

export interface PersistentDrawerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  drawerGroupItems: DrawerGroupItemProps[]
}

export function PersistentDrawer({
  className,
  title,
  drawerGroupItems,
  ...props
}: PersistentDrawerProps) {
  const appBarState = React.useContext(AppBarContext)

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
        <span className="font-semibold">{title}</span>
      </div>
      <div className="flex-1 space-y-1 overflow-auto p-2">
        <DrawerGroupItems items={drawerGroupItems} />
      </div>
    </div>
  )
}

function DrawerGroupItems({ items }: { items: DrawerGroupItemProps[] }) {
  const pathname = usePathname()

  return items.map((item) => (
    <React.Fragment key={item.id}>
      {item.separator && <Separator className="!my-4" />}
      {item.label && (
        <span className="flex p-1 text-sm font-semibold text-muted-foreground">
          {item.label}
        </span>
      )}
      <DrawerItems items={item.items} pathname={pathname} />
    </React.Fragment>
  ))
}

function DrawerItems({
  items,
  pathname,
}: {
  items: DrawerItemProps[]
  pathname: string
}) {
  return items.map((item) => (
    <Link
      key={item.id}
      href={item.href}
      className={cn(
        'relative flex rounded px-2 py-1 text-sm text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
        pathname.startsWith(item.href) ? 'bg-gray-100 text-gray-900' : ''
      )}
    >
      {item.iconName && (
        <LucideIcon
          name={item.iconName}
          className="mr-2 mt-0.5 size-4 min-w-4"
        />
      )}
      {item.title}
    </Link>
  ))
}
