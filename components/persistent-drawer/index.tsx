'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { AppBarContext } from '@/components/app-bar/app-bar-provider'
import { cn } from '@/lib/utils'

import { DrawerGroupItemProps } from '@/types/dashboard'
import { DrawerGroupItems } from './drawer-group-items'

export interface PersistentDrawerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  drawerGroupItems: DrawerGroupItemProps[]
}

export function PersistentDrawer({
  className,
  title,
  drawerGroupItems,
  translate,
  ...props
}: PersistentDrawerProps) {
  const appBarState = React.useContext(AppBarContext)
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
          appBarState?.height ?? 'h-[50px]'
        )}
      >
        <span className="font-semibold">
          {title && translate === 'yes'
            ? t(`PersistentDrawer.${title}`)
            : title}
        </span>
      </div>
      <div className="flex-1 space-y-1 overflow-auto p-2">
        <DrawerGroupItems items={drawerGroupItems} />
      </div>
    </div>
  )
}
