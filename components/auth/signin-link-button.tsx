'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation, Trans } from 'react-i18next'

import { Button, ButtonProps } from '@/components/ui/button'

export interface SignInLinkButtonProps
  extends ButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SignInLinkButton({
  variant = 'ghost',
  ...props
}: SignInLinkButtonProps) {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <Button
      variant={variant}
      onClick={() => router.push('/auth/signin')}
      {...props}
    >
      <Trans t={t}>Sign In</Trans>
    </Button>
  )
}
