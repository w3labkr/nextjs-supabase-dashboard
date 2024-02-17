'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

import { Separator } from '@/components/ui/separator'

import { MiniDrawerGroupItemProps } from '@/types/dashboard'
import { MiniDrawerItems } from './mini-drawer-items'

export interface MiniDrawerGroupItemsProps {
  items: MiniDrawerGroupItemProps[]
}

export function MiniDrawerGroupItems({ items }: MiniDrawerGroupItemsProps) {
  const pathname = usePathname()

  return items.map((item) => (
    <React.Fragment key={item.id}>
      {item.separator && <Separator />}
      <MiniDrawerItems items={item.items} pathname={pathname} />
    </React.Fragment>
  ))
}
