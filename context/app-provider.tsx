'use client'

import * as React from 'react'

import { ReduxProvider } from '@/lib/redux/redux-provider'

import { ThemeProvider } from './theme-provider'
import { I18nProvider } from './i18n-provider'
import { AuthProvider } from './auth-provider'
import { SWRProvider } from './swr-provider'

const providers = [
  ReduxProvider,
  AuthProvider,
  I18nProvider,
  SWRProvider,
  ThemeProvider,
]

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
