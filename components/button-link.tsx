'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { LucideIcon, LucideIconName } from '@/lib/lucide-icon'
import { ButtonProps, buttonVariants } from '@/components/ui/button'

export interface ButtonLinkProps
  extends LinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  startIconName?: LucideIconName | undefined
  startIconClassName?: string | undefined
  endIconName?: LucideIconName | undefined
  endIconClassName?: string | undefined
  text?: string | undefined
  variant?: ButtonProps['variant']
}

export function ButtonLink({
  children,
  className,
  startIconName,
  startIconClassName,
  endIconName,
  endIconClassName,
  text,
  translate,
  variant = 'ghost',
  ...props
}: ButtonLinkProps) {
  const { t } = useTranslation()

  return (
    <Link className={cn(buttonVariants({ variant }), className)} {...props}>
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
    </Link>
  )
}
