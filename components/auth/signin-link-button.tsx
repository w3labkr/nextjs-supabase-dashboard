'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import type { SetOptional } from 'type-fest'
import { ForwardButton, ForwardButtonProps } from '@/components/forward-button'

export type SignInButtonProps = SetOptional<ForwardButtonProps, 'href'>

export function SignInLinkButton({
  variant = 'ghost',
  href = '/auth/signin',
  ...props
}: SignInButtonProps) {
  const { t } = useTranslation()

  return (
    <ForwardButton variant={variant} href={href} {...props}>
      {t('Sign In')}
    </ForwardButton>
  )
}
