'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import { useTranslation } from 'react-i18next'

import { cn } from '@/utils/tailwind'
import { LucideIcon, LucideIconNameProp } from '@/lib/lucide-icon'
import { buttonVariants } from '@/components/ui/button'

export interface ButtonLinkProps
  extends LinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  startIconName?: LucideIconNameProp | undefined
  startIconClassName?: string | undefined
  endIconName?: LucideIconNameProp | undefined
  endIconClassName?: string | undefined
  text?: string | undefined
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
  ...props
}: ButtonLinkProps) {
  const { t } = useTranslation()

  return (
    <Link
      className={cn(buttonVariants({ variant: 'ghost' }), className)}
      {...props}
    >
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
