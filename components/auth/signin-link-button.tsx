'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation, Trans } from 'react-i18next'

import { Button, ButtonProps } from '@/components/ui/button'

export interface SignInLinkButtonProps
  extends ButtonProps,
    React.RefAttributes<HTMLButtonElement> {
  href?: string
  title?: string
}

export function SignInLinkButton({
  variant = 'ghost',
  href = '/auth/signin',
  title = 'Sign In',
  ...props
}: SignInLinkButtonProps) {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <Button variant={variant} onClick={() => router.push(href)} {...props}>
      <Trans t={t}>{title}</Trans>
    </Button>
  )
}
