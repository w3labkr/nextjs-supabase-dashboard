'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { defaultLabel, languageItems } from '@/i18next.config'
import { useAppSelector } from '@/lib/redux/hooks'

const LanguageStatus = () => {
  const { t } = useTranslation()
  const resolvedLanguage = useAppSelector(
    (state) => state?.i18n?.resolvedLanguage
  )
  const [label, setLabel] = React.useState<string>(defaultLabel)

  React.useEffect(() => {
    setLabel(
      languageItems.find((l) => l.value === resolvedLanguage)?.label || ''
    )
  }, [resolvedLanguage])

  return (
    <span>
      {t('language')}: {label}
    </span>
  )
}

export { LanguageStatus }
