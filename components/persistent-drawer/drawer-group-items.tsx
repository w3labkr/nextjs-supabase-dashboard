'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { Separator } from '@/components/ui/separator'

import { DrawerGroupItemProps } from '@/types/dashboard'
import { DrawerItems } from './drawer-items'

export interface DrawerGroupItemsProps {
  items: DrawerGroupItemProps[]
}

export function DrawerGroupItems({ items }: DrawerGroupItemsProps) {
  const { t } = useTranslation()
  const pathname = usePathname()

  return items.map((item) => (
    <React.Fragment key={item.id}>
      {item.separator && <Separator className="!my-4" />}
      {item.label && (
        <span className="flex p-1 text-sm font-semibold text-muted-foreground">
          {item.label && item.translate === 'yes' ? t(item.label) : item.label}
        </span>
      )}
      <DrawerItems items={item.items} pathname={pathname} />
    </React.Fragment>
  ))
}
