'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TooltipContentProps } from '@radix-ui/react-tooltip'

export interface TooltipLinkProps
  extends LinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  tooltipContent?: TooltipContentProps
}

export function TooltipLink({
  children,
  title,
  tooltipContent,
  ...props
}: TooltipLinkProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link {...props}>{children}</Link>
        </TooltipTrigger>
        <TooltipContent {...tooltipContent}>{title}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
