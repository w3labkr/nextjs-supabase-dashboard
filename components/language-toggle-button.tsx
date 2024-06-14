'use client'

import * as React from 'react'

import { useTranslation } from 'react-i18next'
import { defaultLng, fallbackLng } from '@/i18next.config'
import { Button, ButtonProps } from '@/components/ui/button'

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { setResolvedLanguage } from '@/store/features/i18n-slice'

interface LanguageToggleButtonProps
  extends ButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

const LanguageToggleButton = (props: LanguageToggleButtonProps) => {
  const { variant = 'ghost', size = 'sm', ...rest } = props
  const dispatch = useAppDispatch()
  const resolvedLanguage = useAppSelector(
    (state) => state.i18n.resolvedLanguage
  )
  const [currentLanguage, setCurrentLanguage] =
    React.useState<string>(resolvedLanguage)
  const { i18n } = useTranslation()

  const onClick = () => {
    const currentValue =
      currentLanguage === defaultLng ? fallbackLng : defaultLng

    i18n.changeLanguage(currentValue)
    document.documentElement.lang = currentValue
    setCurrentLanguage(currentValue)
    dispatch(setResolvedLanguage(currentValue))
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={onClick}
      {...rest}
    >
      {currentLanguage?.toUpperCase()}
    </Button>
  )
}

export { LanguageToggleButton, type LanguageToggleButtonProps }
