'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { LucideIcon, LucideIconName } from '@/lib/lucide-icon'
import { Button, ButtonProps } from '@/components/ui/button'

interface LinkButtonProps
  extends ButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  href: string
  text?: string
  startIconName?: LucideIconName
  startIconClassName?: string
  endIconName?: LucideIconName
  endIconClassName?: string
}

const LinkButton = React.forwardRef<HTMLButtonElement, LinkButtonProps>(
  (props, ref) => {
    const {
      children,
      href,
      text,
      translate,
      startIconName,
      startIconClassName,
      endIconName,
      endIconClassName,
      ...rest
    } = props
    const router = useRouter()
    const { t } = useTranslation()

    return (
      <Button ref={ref} onClick={() => router.push(href)} {...rest}>
        {startIconName && (
          <LucideIcon
            name={startIconName}
            className={cn('mr-2 size-4 min-w-4', startIconClassName)}
          />
        )}
        {text && translate === 'yes' ? t(text) : text}
        {children}
        {endIconName && (
          <LucideIcon
            name={endIconName}
            className={cn('ml-2 size-4 min-w-4', endIconClassName)}
          />
        )}
      </Button>
    )
  }
)

LinkButton.displayName = 'LinkButton'

export { LinkButton, type LinkButtonProps }
