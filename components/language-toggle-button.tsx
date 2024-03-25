'use client'

import * as React from 'react'

import { useTranslation } from 'react-i18next'
import { defaultLng, fallbackLng } from '@/i18next.config'

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
  const [currentLanguage, setCurrentLanguage] =
    React.useState<string>(resolvedLanguage)
  const { i18n } = useTranslation()

  const handleClick = () => {
    const currentValue =
      currentLanguage === defaultLng ? fallbackLng : defaultLng
    i18n.changeLanguage(currentValue)
    document.documentElement.lang = currentValue
    setCurrentLanguage(currentValue)
    dispatch(setResolvedLanguage(currentValue))
  }

  return (
    <button
      type="button"
      className={cn('text-sm underline underline-offset-4', className)}
      onClick={handleClick}
      {...props}
    >
      {(currentLanguage === defaultLng
        ? fallbackLng
        : defaultLng
      )?.toUpperCase()}
    </button>
  )
}
