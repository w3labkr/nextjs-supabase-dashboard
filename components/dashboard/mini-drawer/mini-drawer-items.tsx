'use client'

import * as React from 'react'

import { cn } from '@/utils/tailwind'
import { LucideIcon } from '@/lib/lucide-icon'
import { Badge } from '@/components/ui/badge'
import { TooltipLink } from '@/components/tooltip-link'

import { MiniDrawerItemProps } from '@/types/dashboard'

export interface MiniDrawerItemsProps {
  items: MiniDrawerItemProps[]
  pathname: string
}

export function MiniDrawerItems({ items, pathname }: MiniDrawerItemsProps) {
  return items.map((item) => (
    <TooltipLink
      key={item.id}
      href={item.href}
      className={cn(
        'relative flex justify-center rounded-lg p-1 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
        pathname.startsWith(item.href)
          ? 'text-gray-900 dark:text-gray-50'
          : 'text-gray-500'
      )}
      tooltipContent={{ side: 'right', align: 'end', alignOffset: 6 }}
      text={item.title}
      translate="yes"
    >
      {item.iconName && <LucideIcon name={item.iconName} className="size-5" />}
      {!!item.badge && (
        <Badge
          className="absolute bottom-0 right-0 justify-center px-1 py-0.5"
          style={{ fontSize: 10, lineHeight: 1 }}
        >
          {item.badge}
        </Badge>
      )}
    </TooltipLink>
  ))
}
