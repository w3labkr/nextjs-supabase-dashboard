'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { AppBarContext } from '@/context/app-bar-provider'
import { cn } from '@/utils/tailwind'

export interface drawerItemProps {
  id: number
  title: string
  href: string
}

export interface PersistentDrawerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  drawerItems: drawerItemProps[]
}

export function PersistentDrawer({
  className,
  title,
  drawerItems,
  ...props
}: PersistentDrawerProps) {
  const appBarState = React.useContext(AppBarContext)
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
          'flex flex-row items-center gap-2 border-b px-4 font-bold',
          appBarState?.height ?? 'h-[50px]'
        )}
      >
        <span>{title}</span>
      </div>
      <div className="flex-1 space-y-1 overflow-auto p-2">
        {drawerItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              'relative flex rounded px-2 py-1 text-sm text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
              pathname.startsWith(item.href) ? 'bg-gray-100 text-gray-900' : ''
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  )
}
