'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

import { AppBarContext } from '@/context/app-bar-provider'
import { LucideIcon } from '@/lib/lucide-icon'
import { cn } from '@/utils/tailwind'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import { siteConfig } from '@/config/site'
import { dashboardConfig } from '@/config/dashboard'
import { TooltipLink } from '@/components/tooltip-link'

export interface MiniDrawerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MiniDrawer({ className, ...props }: MiniDrawerProps) {
  const appBarState = React.useContext(AppBarContext)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        'flex flex-col border-r bg-background px-2',
        'w-14 min-w-14',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'flex items-center justify-center border-b',
          appBarState?.height ?? 'h-[50px]'
        )}
      >
        <LucideIcon name={siteConfig.symbol} className="size-5" />
        <span className="sr-only">{siteConfig.name}</span>
      </div>
      <nav className="flex-1 space-y-2 overflow-auto py-2">
        {dashboardConfig.miniDrawer.map((item) => (
          <React.Fragment key={item.id}>
            {item.separator && <Separator />}
            <TooltipLink
              href={item.href}
              title={item.title}
              className={cn(
                'relative flex justify-center rounded-lg p-1 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
                pathname.startsWith(item.href)
                  ? 'text-gray-900 dark:text-gray-50'
                  : 'text-gray-500'
              )}
              tooltipContent={{ side: 'right', align: 'end', alignOffset: 6 }}
            >
              {item.icon ? (
                <LucideIcon name={item.icon} className="size-5" />
              ) : (
                item.title
              )}
              {!!item.badge && (
                <Badge
                  className="absolute bottom-0 right-0 justify-center px-1 py-0.5"
                  style={{ fontSize: 10, lineHeight: 1 }}
                >
                  {item.badge}
                </Badge>
              )}
            </TooltipLink>
          </React.Fragment>
        ))}
      </nav>
    </div>
  )
}
