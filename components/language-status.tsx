'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { languages } from '@/i18next.config'

import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'

export function LanguageStatus() {
  const resolvedLanguage = useSelector(
    (state: RootState) => state.i18n.resolvedLanguage
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
