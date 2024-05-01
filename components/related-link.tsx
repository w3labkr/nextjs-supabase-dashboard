'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

export interface RelatedLinkProps
  extends LinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  text?: string
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
        'text-primary underline hover:text-muted-foreground',
        className
      )}
      {...props}
    >
      {text && translate === 'yes' ? t(text) : text}
      {children}
    </Link>
  )
}
