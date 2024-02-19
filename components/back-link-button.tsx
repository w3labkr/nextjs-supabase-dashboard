'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { cn } from '@/utils/tailwind'
import { LucideIcon, LucideIconNameProp } from '@/lib/lucide-icon'
import { Button, ButtonProps } from '@/components/ui/button'

export interface BackLinkButtonProps
  extends ButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  startIconName?: LucideIconNameProp | undefined
  startIconClassName?: string | undefined
  endIconName?: LucideIconNameProp | undefined
  endIconClassName?: string | undefined
  text?: string | undefined
}

export const BackLinkButton = React.forwardRef<
  HTMLButtonElement,
  BackLinkButtonProps
>((props, ref) => {
  const {
    children,
    startIconName,
    startIconClassName,
    endIconName,
    endIconClassName,
    translate,
    text = 'Back',
    ...rest
  } = props
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <Button ref={ref} onClick={() => router.back()} {...rest}>
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
})

BackLinkButton.displayName = 'BackLinkButton'
