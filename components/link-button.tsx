'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import { useTranslation, Trans } from 'react-i18next'

import { Button, ButtonProps } from '@/components/ui/button'

export interface LinkButtonProps extends ButtonProps, Pick<LinkProps, 'href'> {}

export function LinkButton({
  children,
  href,
  title,
  ...props
}: LinkButtonProps) {
  const { t } = useTranslation()

  return (
    <Button asChild {...props}>
      <Link href={href}>
        <Trans t={t}>{title}</Trans>
        {children}
      </Link>
    </Button>
  )
}
