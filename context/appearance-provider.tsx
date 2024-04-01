'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'

import { useAuth } from '@/hooks/use-auth'
import { useAppearance } from '@/hooks/sync/use-appearance'

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { setResolvedLanguage } from '@/store/features/i18n-slice'

export interface AppearanceContextProps {
  theme: string | null
  language: string | null
}

export const AppearanceContext = React.createContext<AppearanceContextProps>({
  theme: null,
  language: null,
})

export function AppearanceProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const { appearance } = useAppearance(user?.id ?? null)
  const value = React.useMemo(
    () => ({
      theme: appearance?.theme ?? null,
      language: appearance?.language ?? null,
    }),
    [appearance]
  )

  return (
    <AppearanceContext.Provider value={value}>
      <LanguageProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </LanguageProvider>
    </AppearanceContext.Provider>
  )
}

const ThemeContext = React.createContext<string | null>(null)

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const appearance = React.useContext(AppearanceContext)
  const value = React.useMemo(() => appearance?.theme, [appearance?.theme])
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    if (value && theme !== value) {
      setTheme(value)
    }
  }, [theme, setTheme, value])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

const LanguageContext = React.createContext<string | null>(null)

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
  }, [i18n, resolvedLanguage, dispatch, value])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
