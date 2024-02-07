'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'

import { AppBarContext } from '@/context/app-bar-provider'
import { LucideIcon } from '@/lib/lucide-icon'
import { cn } from '@/utils/tailwind'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TooltipContentProps } from '@radix-ui/react-tooltip'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export interface MiniDrawerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MiniDrawer({ className, ...props }: MiniDrawerProps) {
  const appBarState = React.useContext(AppBarContext)

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
        <LucideIcon name="Package2" className="size-5" />
      </div>
      <nav className="flex-1 space-y-2 overflow-auto py-2">
        <TooltipLink href="/dashboard/dashboard" title="Dashboard">
          <LucideIcon name="LayoutDashboard" className="size-5" />
          <Badge
            className="absolute bottom-0 right-0 justify-center px-1 py-0.5"
            style={{ fontSize: 10, lineHeight: 1 }}
          >
            9
          </Badge>
        </TooltipLink>
        <TooltipLink href="/dashboard/media" title="Media">
          <LucideIcon name="Image" className="size-5" />
        </TooltipLink>
        <TooltipLink href="/dashboard/posts" title="Posts">
          <LucideIcon name="StickyNote" className="size-5" />
        </TooltipLink>
        <Separator />
        <TooltipLink href="/dashboard/settings" title="Settings">
          <LucideIcon name="Settings" className="size-5" />
        </TooltipLink>
      </nav>
    </div>
  )
}

interface TooltipLinkProps
  extends LinkProps,
    // Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    Pick<TooltipContentProps, 'side' | 'align' | 'alignOffset'> {
  href: string
  title: string
  children?: React.ReactNode
  className?: string
}

function TooltipLink({
  href,
  title,
  children,
  className,
  side = 'right',
  align = 'end',
  alignOffset = 6,
  ...props
}: TooltipLinkProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              'relative flex justify-center rounded-lg p-1 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
              pathname.startsWith(href)
                ? 'text-gray-900 dark:text-gray-50'
                : 'text-gray-500',
              className
            )}
            {...props}
          >
            {children}
          </Link>
        </TooltipTrigger>
        {title && (
          <TooltipContent side={side} align={align} alignOffset={alignOffset}>
            {title}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}
