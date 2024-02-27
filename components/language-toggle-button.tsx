'use client'

import * as React from 'react'

import { useTranslation } from 'react-i18next'
import { lng, fallbackLng } from '@/i18next.config'

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { setResolvedLanguage } from '@/store/features/i18n-slice'

import { cn } from '@/lib/utils'

export interface LanguageToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function LanguageToggleButton({
  className,
  ...props
}: LanguageToggleProps) {
  const dispatch = useAppDispatch()
  const resolvedLanguage = useAppSelector(
    (state) => state.i18n.resolvedLanguage
  )
  const [language, setLanguage] = React.useState<string>(resolvedLanguage)
  const { i18n } = useTranslation()

  const onClick = () => {
    const currentValue = language === lng ? fallbackLng : lng
    i18n.changeLanguage(currentValue)
    document.documentElement.lang = currentValue
    setLanguage(currentValue)
    dispatch(setResolvedLanguage(currentValue))
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
