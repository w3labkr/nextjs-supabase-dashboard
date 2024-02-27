'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { languages } from '@/i18next.config'

import { useAppSelector } from '@/lib/redux/hooks'

export function LanguageStatus() {
  const resolvedLanguage = useAppSelector(
    (state) => state.i18n.resolvedLanguage
  )
  const [languageLabel, setLanguageLabel] = React.useState<string>('')
  const { t } = useTranslation()

  React.useEffect(() => {
    const label =
      languages.find((l) => l.value === resolvedLanguage)?.label || ''
    setLanguageLabel(label)
  }, [resolvedLanguage])

  return (
    <span>
      {t('LanguageStatus.label')}: {languageLabel}
    </span>
  )
}
