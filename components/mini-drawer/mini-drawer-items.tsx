import * as React from 'react'

import { cn } from '@/utils/tailwind'
import { Badge } from '@/components/ui/badge'
import { TooltipForwardButton } from '@/components/tooltip-forward-button'

import { MiniDrawerItemProps } from '@/types/dashboard'

export interface MiniDrawerItemsProps {
  items: MiniDrawerItemProps[]
  pathname: string
}

export function MiniDrawerItems({ items, pathname }: MiniDrawerItemsProps) {
  return items.map((item) => (
    <TooltipForwardButton
      variant="ghost"
      key={item.id}
      href={item.href}
      className={cn(
        'relative flex h-auto justify-center rounded-lg px-2 py-0.5 transition-all',
        'text-gray-500 hover:bg-transparent hover:text-gray-900',
        'dark:text-gray-400 dark:hover:text-gray-50',
        pathname.startsWith(item.href) ? 'text-gray-900 dark:text-gray-50' : ''
      )}
      startIconName={item.iconName}
      startIconClassName="size-5 min-w-5 mr-0"
      text={item.title}
      translate={item.translate}
      tooltipContent={{ side: 'right', align: 'end', alignOffset: 6 }}
      disabled={item.disabled}
    >
      {!!item.badge && (
        <Badge
          className="absolute bottom-0 right-0 justify-center px-1 py-0.5"
          style={{ fontSize: 10, lineHeight: 1 }}
        >
          {item.badge}
        </Badge>
      )}
    </TooltipForwardButton>
  ))
}
