'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { languages } from '@/i18next.config'

export function LanguageStatus() {
  const { t, i18n } = useTranslation()

  return (
    <span>
      {languages.map((language) => {
        if (language.value !== i18n.resolvedLanguage) return
        return (
          <React.Fragment key={language.value}>
            {t('Language')}: {language.label}
          </React.Fragment>
        )
      })}
    </span>
  )
}
