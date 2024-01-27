'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { ForwardButton } from '@/components/forward-button'

export function ForwardSignInButton() {
  const { t } = useTranslation()

  return (
    <ForwardButton
      variant="ghost"
      className="absolute right-4 top-4 md:right-8 md:top-8"
      href="/signin"
    >
      {t('Sign In')}
    </ForwardButton>
  )
}
