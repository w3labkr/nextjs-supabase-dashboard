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

interface AppContextProps {
  children: React.ReactNode
  providers: Array<React.JSXElementConstructor<React.PropsWithChildren<any>>>
}

const AppContext = (props: AppContextProps) => {
  const { children, providers = [] } = props

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

interface AppProviderProps {
  children: React.ReactNode
}

const AppProvider = (props: AppProviderProps) => {
  const { children } = props

  return <AppContext providers={providers}>{children}</AppContext>
}

export { AppProvider, type AppProviderProps }
