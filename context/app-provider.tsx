'use client'

import * as React from 'react'

import { ReduxProvider } from '@/lib/redux/redux-provider'
import { AuthProvider } from './auth-provider'
import { SWRProvider } from './swr-provider'

const providers = [ReduxProvider, AuthProvider, SWRProvider]

interface AppContextProps {
  children?: React.ReactNode
  providers: Array<React.JSXElementConstructor<React.PropsWithChildren<any>>>
}

const AppContext = ({ children, providers = [] }: AppContextProps) => {
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
  children?: React.ReactNode
}

const AppProvider = ({ children }: AppProviderProps) => {
  return <AppContext providers={providers}>{children}</AppContext>
}

export { AppProvider, type AppProviderProps }
