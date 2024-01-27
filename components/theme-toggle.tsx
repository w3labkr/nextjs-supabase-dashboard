'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      <SunIcon className="h-5 w-5 dark:hidden" />
      <MoonIcon className="hidden h-5 w-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
