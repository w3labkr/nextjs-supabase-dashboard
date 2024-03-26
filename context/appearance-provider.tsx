'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'

import { User } from '@supabase/supabase-js'
import { useAppearance } from '@/hooks/api/use-appearance'

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { setResolvedLanguage } from '@/store/features/i18n-slice'
import { Appearance } from '@/types/database'

export const AppearanceContext = React.createContext<Appearance | null>(null)

export function AppearanceProvider({
  children,
  user,
}: {
  children: React.ReactNode
  user: User | null
}) {
  const { appearance } = useAppearance(user?.id ?? null)
  const value = React.useMemo(() => appearance, [appearance])

  return (
    <AppearanceContext.Provider value={value}>
      <LanguageProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </LanguageProvider>
    </AppearanceContext.Provider>
  )
}

const ThemeContext = React.createContext<string | undefined>(undefined)

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const appearance = React.useContext(AppearanceContext)
  const value = React.useMemo(() => appearance?.theme, [appearance?.theme])
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    if (value && theme !== value) {
      setTheme(value)
    }
  }, [value, setTheme, theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

const LanguageContext = React.createContext<string | undefined>(undefined)

function LanguageProvider({ children }: { children: React.ReactNode }) {
  const appearance = React.useContext(AppearanceContext)
  const value = React.useMemo(
    () => appearance?.language,
    [appearance?.language]
  )

  const { i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const resolvedLanguage = useAppSelector(
    (state) => state?.i18n?.resolvedLanguage
  )

  React.useEffect(() => {
    if (value && resolvedLanguage !== value) {
      i18n.changeLanguage(value)
      document.documentElement.lang = value
      dispatch(setResolvedLanguage(value))
    }
  }, [resolvedLanguage, value, dispatch, i18n])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
