'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { languages } from '@/i18next.config'

export function LanguageStatus() {
  const [languageLabel, setLanguageLabel] = React.useState<string>('')
  const { t, i18n } = useTranslation()

  React.useEffect(() => {
    const label =
      languages.find((l) => l.value === i18n.resolvedLanguage)?.label || ''
    setLanguageLabel(label)
  }, [i18n.resolvedLanguage])

  return (
    <span>
      {t('language')}: {languageLabel}
    </span>
  )
}
