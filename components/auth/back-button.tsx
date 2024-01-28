'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { LuChevronLeft } from 'react-icons/lu'
import type { SetOptional } from 'type-fest'
import { ForwardButton, ForwardButtonProps } from '@/components/forward-button'

export type BackButtonProps = SetOptional<ForwardButtonProps, 'href'>

export function BackButton({
  variant = 'ghost',
  href = '/',
  ...props
}: BackButtonProps) {
  const { t } = useTranslation()

  return (
    <ForwardButton variant={variant} href={href} {...props}>
      <LuChevronLeft className="mr-2 h-4 w-4" />
      {t('Back')}
    </ForwardButton>
  )
}
