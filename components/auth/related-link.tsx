'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import { useTranslation } from 'react-i18next'

import { cn } from '@/utils/tailwind'

export interface RelatedLinkProps
  extends LinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  text?: string | undefined
}

export function RelatedLink({
  children,
  className,
  text,
  translate,
  ...props
}: RelatedLinkProps) {
  const { t } = useTranslation()

  return (
    <Link
      className={cn(
        'text-primary underline underline-offset-4 hover:text-muted-foreground',
        className
      )}
      {...props}
    >
      {text && translate === 'yes' ? t(text) : text}
      {children}
    </Link>
  )
}
