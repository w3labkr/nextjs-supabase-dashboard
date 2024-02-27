'use client'

import * as React from 'react'

import { ReduxProvider } from '@/lib/redux/redux-provider'
import { I18nProvider } from '@/lib/i18n/i18n-provider'
import { AuthProvider } from '@/context/auth-provider'
import { ThemeProvider } from '@/context/theme-provider'

const providers = [ReduxProvider, AuthProvider, I18nProvider, ThemeProvider]

export interface AppContextProps {
  children: React.ReactNode
  providers: Array<React.JSXElementConstructor<React.PropsWithChildren<any>>>
}

export function AppContext({ children, providers = [] }: AppContextProps) {
  return (
    <React.Fragment>
      {providers.reduceRight(
        (child, Provider) => (
          <Provider>{child}</Provider>
        ),
        children
      )}
    </React.Fragment>
  )
}

export interface AppProviderProps {
  children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return <AppContext providers={providers}>{children}</AppContext>
}
