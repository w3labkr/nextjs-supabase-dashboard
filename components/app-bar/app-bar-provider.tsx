'use client'

import * as React from 'react'

export interface AppBarContextProps {
  height: string
}

export const AppBarContext = React.createContext<
  AppBarContextProps | undefined
>(undefined)

export function AppBarProvider({ children }: { children: React.ReactNode }) {
  const value = React.useMemo(() => ({ height: 'h-[50px]' }), [])

  return (
    <AppBarContext.Provider value={value}>{children}</AppBarContext.Provider>
  )
}

export function useAppBar() {
  const context = React.useContext<AppBarContextProps | undefined>(
    AppBarContext
  )

  if (context === undefined) {
    throw new Error('useAppBar must be used within AppBarProvider')
  }

  return context
}
