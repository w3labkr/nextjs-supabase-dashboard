'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

import { LucideIcon } from '@/lib/lucide-icon'

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <LucideIcon name="Sun" size={20} className="dark:hidden" />
      <LucideIcon name="Moon" size={20} className="hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

export { ThemeToggle }
