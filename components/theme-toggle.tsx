'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { useAppDispatch } from '@/lib/redux/hooks'
import { setAppTheme } from '@/store/reducers/app-reducer'
import { LucideIcon } from '@/lib/lucide-icon'

interface ThemeToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {}

const ThemeToggle = (props: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme()
  const dispatch = useAppDispatch()

  const onClick = () => {
    const value = theme === 'light' ? 'dark' : 'light'
    setTheme(value)
    dispatch(setAppTheme(value))
  }

  return (
    <button type="button" onClick={onClick} {...props}>
      <LucideIcon name="Sun" className="size-5 min-w-5 dark:hidden" />
      <LucideIcon name="Moon" className="hidden size-5 min-w-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

export { ThemeToggle, type ThemeToggleProps }
