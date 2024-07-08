'use client'

import * as React from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18next'
import { defaultNS } from '@/i18next.config'

import { useAppDispatch } from '@/lib/redux/hooks'
import { setAppLanguage } from '@/store/reducers/app-reducer'

interface I18nProviderProps {
  children?: React.ReactNode
  value: { language: string }
}

const I18nProvider = ({ children, value }: I18nProviderProps) => {
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    i18n.changeLanguage(value?.language)
    dispatch(setAppLanguage(value?.language))
  }, [value?.language, dispatch])

  return (
    <I18nextProvider i18n={i18n} defaultNS={defaultNS}>
      {children}
    </I18nextProvider>
  )
}

export { I18nProvider, type I18nProviderProps }
