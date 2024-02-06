'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'

import { Trans, useTranslation } from 'react-i18next'
import { cn } from '@/utils/tailwind'

export type RelatedLinkProps = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement>

export function RelatedLink({
  children,
  className,
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
      <Trans t={t}>{children}</Trans>
    </Link>
  )
}
