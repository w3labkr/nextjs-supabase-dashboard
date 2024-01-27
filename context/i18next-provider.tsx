'use client'

import * as React from 'react'
import { I18nextProvider as I18nProvider } from 'react-i18next'
import i18next from '@/lib/i18next'
import { defaultNS } from '@/i18next.config'

export function I18nextProvider({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider i18n={i18next} defaultNS={defaultNS}>
      {children}
    </I18nProvider>
  )
}
