'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

import { LucideIcon } from '@/lib/lucide-icon'

interface ThemeToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ThemeToggle = (props: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={() => {
        const value = theme === 'light' ? 'dark' : 'light'
        setTheme(value)
        document.cookie = `theme=${value};path=/`
      }}
      {...props}
    >
      <LucideIcon name="Sun" className="size-5 min-w-5 dark:hidden" />
      <LucideIcon name="Moon" className="hidden size-5 min-w-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

export { ThemeToggle, type ThemeToggleProps }
