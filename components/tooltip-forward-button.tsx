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
import { ForwardButton, ForwardButtonProps } from '@/components/forward-button'

export interface TooltipForwardButtonProps extends ForwardButtonProps {
  tooltipContent?: TooltipContentProps | undefined
}

export function TooltipForwardButton({
  children,
  text,
  translate,
  tooltipContent,
  ...props
}: TooltipForwardButtonProps) {
  const { t } = useTranslation()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <ForwardButton {...props}>{children}</ForwardButton>
          </div>
        </TooltipTrigger>
        <TooltipContent {...tooltipContent}>
          {text && translate === 'yes' ? t(text) : text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
