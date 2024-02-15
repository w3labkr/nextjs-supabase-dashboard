'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { cn } from '@/utils/tailwind'
import { LucideIcon, LucideIconProps } from '@/lib/lucide-icon'
import { Button, ButtonProps } from '@/components/ui/button'

export interface ForwardButtonProps
  extends ButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  href: string
  title?: string
  startIconName?: LucideIconProps['name']
  startIconClassName?: string
  endIconName?: LucideIconProps['name']
  endIconClassName?: string
}

export function ForwardButton({
  children,
  href,
  title,
  startIconName,
  startIconClassName,
  endIconName,
  endIconClassName,
  ...props
}: ForwardButtonProps) {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <Button onClick={() => router.push(href)} {...props}>
      {startIconName && (
        <LucideIcon
          name={startIconName}
          className={cn('mr-2 size-4', startIconClassName)}
        />
      )}
      {title ? t(title) : children}
      {endIconName && (
        <LucideIcon
          name={endIconName}
          className={cn('ml-2 size-4', endIconClassName)}
        />
      )}
    </Button>
  )
}
