'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { LuChevronLeft } from 'react-icons/lu'

import { ForwardButton } from '@/components/forward-button'

export function ForwardBackButton() {
  const { t } = useTranslation()

  return (
    <ForwardButton
      variant="ghost"
      className="absolute left-4 top-4 md:left-8 md:top-8"
      href="/"
    >
      <LuChevronLeft className="mr-2 h-4 w-4" />
      {t('Back')}
    </ForwardButton>
  )
}
