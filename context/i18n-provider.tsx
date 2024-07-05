'use client'

import * as React from 'react'

import { I18nextProvider } from 'react-i18next'
import i18next from '@/lib/i18next'
import { defaultNS } from '@/i18next.config'

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { setResolvedLanguage } from '@/store/features/i18n-slice'

const I18nProvider = ({ children }: { children?: React.ReactNode }) => {
  const dispatch = useAppDispatch()
  const { resolvedLanguage } = useAppSelector(({ i18n }) => i18n)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    i18next.changeLanguage(resolvedLanguage)
    document.documentElement.lang = resolvedLanguage
    dispatch(setResolvedLanguage(resolvedLanguage))

    setIsLoading(false)
  }, [resolvedLanguage, dispatch])

  return (
    <I18nextProvider i18n={i18next} defaultNS={defaultNS}>
      {!isLoading && children}
    </I18nextProvider>
  )
}

export { I18nProvider }
