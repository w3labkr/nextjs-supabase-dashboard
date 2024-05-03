'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

import { LucideIcon } from '@/lib/lucide-icon'

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      <LucideIcon name="Sun" className="size-5 min-w-5 dark:hidden" />
      <LucideIcon name="Moon" className="hidden size-5 min-w-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

export { ThemeToggle }
