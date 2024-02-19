'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'

export function DarkModeStatus() {
  const [status, setStatus] = React.useState<string>('')
  const { t } = useTranslation()
  const { theme } = useTheme()

  React.useEffect(() => {
    const mode = theme === 'light' ? 'dark_mode_off' : 'dark_mode_on'
    setStatus(mode)
  }, [theme])

  return <span>{t(status)}</span>
}
