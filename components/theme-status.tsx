'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'

export function DarkModeStatus() {
  const [translated, setTranslated] = React.useState('Dark mode: off')
  const { theme } = useTheme()
  const { t } = useTranslation()

  React.useEffect(() => {
    const mode = theme === 'light' ? 'Dark mode: off' : 'Dark mode: on'
    setTranslated(mode)
  }, [theme])

  return <span>{t(translated)}</span>
}
