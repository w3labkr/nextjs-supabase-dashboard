'use client'

import * as React from 'react'

export interface AppBarProviderProps {
  height: string
}

export const AppBarContext = React.createContext<AppBarProviderProps | null>(
  null
)

export function AppBarProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: AppBarProviderProps
}) {
  return (
    <AppBarContext.Provider value={value}>{children}</AppBarContext.Provider>
  )
}
