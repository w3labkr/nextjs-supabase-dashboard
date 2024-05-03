'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import { useTranslation } from 'react-i18next'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TooltipContentProps } from '@radix-ui/react-tooltip'

interface TooltipLinkProps
  extends LinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  tooltipContent?: TooltipContentProps
  text?: string
}

const TooltipLink = (props: TooltipLinkProps) => {
  const { children, tooltipContent, text, translate, ...rest } = props
  const { t } = useTranslation()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link {...rest}>{children}</Link>
        </TooltipTrigger>
        <TooltipContent {...tooltipContent}>
          {text && translate === 'yes' ? t(text) : text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { TooltipLink, type TooltipLinkProps }
