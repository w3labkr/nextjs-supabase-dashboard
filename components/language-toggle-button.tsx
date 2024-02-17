'use client'

import * as React from 'react'

import { useTranslation } from 'react-i18next'
import { lng, fallbackLng } from '@/i18next.config'
import { ResolvedLanguageProp } from '@/types/i18next'

import { cn } from '@/utils/tailwind'

export interface LanguageToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function LanguageToggleButton({
  className,
  ...props
}: LanguageToggleProps) {
  const { i18n } = useTranslation()
  const [language, setLanguage] = React.useState<ResolvedLanguageProp>(
    i18n.resolvedLanguage
  )

  const onClick = () => {
    const currentValue = language === lng ? fallbackLng : lng
    i18n.changeLanguage(currentValue)
    document.documentElement.lang = currentValue
    setLanguage(currentValue)
  }

  return (
    <button
      type="button"
      className={cn('text-sm underline underline-offset-4', className)}
      onClick={onClick}
      {...props}
    >
      {(language === lng ? fallbackLng : lng)?.toUpperCase()}
    </button>
  )
}
