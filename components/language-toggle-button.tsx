'use client'

import * as React from 'react'

import { useTranslation } from 'react-i18next'
import { defaultLng, fallbackLng } from '@/i18next.config'
import { Button, ButtonProps } from '@/components/ui/button'

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { setResolvedLanguage } from '@/store/features/i18n-slice'

export interface LanguageToggleProps
  extends ButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function LanguageToggleButton({
  variant = 'ghost',
  size = 'sm',
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
    <Button variant={variant} size={size} onClick={handleClick} {...props}>
      {currentLanguage?.toUpperCase()}
    </Button>
  )
}
