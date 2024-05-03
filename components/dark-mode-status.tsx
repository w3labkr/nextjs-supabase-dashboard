'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'

const DarkModeStatus = () => {
  const [status, setStatus] = React.useState<string>('')
  const { theme } = useTheme()
  const { t } = useTranslation()

  React.useEffect(() => {
    const mode =
      theme === 'light'
        ? 'DarkModeStatus.dark_mode_off'
        : 'DarkModeStatus.dark_mode_on'
    setStatus(mode)
  }, [theme])

  return <span>{t(status)}</span>
}

export { DarkModeStatus }
