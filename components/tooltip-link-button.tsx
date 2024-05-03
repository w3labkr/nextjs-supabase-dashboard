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

interface TooltipLinkButtonProps extends LinkButtonProps {
  tooltipContent?: TooltipContentProps
}

const TooltipLinkButton = (props: TooltipLinkButtonProps) => {
  const { children, text, translate, tooltipContent, ...rest } = props
  const { t } = useTranslation()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <LinkButton {...rest}>{children}</LinkButton>
          </div>
        </TooltipTrigger>
        <TooltipContent {...tooltipContent}>
          {text && translate === 'yes' ? t(text) : text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { TooltipLinkButton, type TooltipLinkButtonProps }
