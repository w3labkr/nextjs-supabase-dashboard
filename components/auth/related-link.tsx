'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import Link, { LinkProps } from 'next/link'
import type { SetOptional } from 'type-fest'
import { cn } from '@/lib/utils'

export type RelatedLinkProps = SetOptional<LinkProps, 'href'> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>

export function SignUpLink({ className, ...props }: RelatedLinkProps) {
  const { t } = useTranslation()

  return (
    <Link
      href="/signup"
      className={cn(
        'text-primary underline underline-offset-4 hover:text-muted-foreground',
        className
      )}
      {...props}
    >
      {t("Don't have an account? Sign Up")}
    </Link>
  )
}

export function ForgotPasswordLink({ className, ...props }: RelatedLinkProps) {
  const { t } = useTranslation()

  return (
    <Link
      href="#"
      className={cn(
        'text-primary underline underline-offset-4 hover:text-muted-foreground',
        className
      )}
      {...props}
    >
      {t('Forgot password?')}
    </Link>
  )
}
