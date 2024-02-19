'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TooltipContentProps } from '@radix-ui/react-tooltip'
import { LinkButton, LinkButtonProps } from '@/components/link-button'

export interface TooltipLinkButtonProps extends LinkButtonProps {
  tooltipContent?: TooltipContentProps | undefined
}

export function TooltipLinkButton({
  children,
  text,
  translate,
  tooltipContent,
  ...props
}: TooltipLinkButtonProps) {
  const { t } = useTranslation()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <LinkButton {...props}>{children}</LinkButton>
          </div>
        </TooltipTrigger>
        <TooltipContent {...tooltipContent}>
          {text && translate === 'yes' ? t(text) : text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
