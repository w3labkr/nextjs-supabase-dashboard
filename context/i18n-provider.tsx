'use client'

import * as React from 'react'

import { I18nextProvider } from 'react-i18next'
import i18next from '@/lib/i18next'
import { defaultNS } from '@/i18next.config'

import { useAppDispatch } from '@/lib/redux/hooks'
import { setResolvedLanguage } from '@/store/features/i18n-slice'

interface I18nProviderProps {
  children?: React.ReactNode
  value: {
    language: string
  }
}

const I18nProvider = ({ children, value }: I18nProviderProps) => {
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    i18next.changeLanguage(value?.language)
    document.documentElement.lang = value?.language
    dispatch(setResolvedLanguage(value?.language))
  }, [value?.language, dispatch])

  return (
    <I18nextProvider i18n={i18next} defaultNS={defaultNS}>
      {children}
    </I18nextProvider>
  )
}

export { I18nProvider }
