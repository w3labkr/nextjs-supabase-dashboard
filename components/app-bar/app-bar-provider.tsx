'use client'

import * as React from 'react'

export interface AppBarProviderProps {
  height: string
}

export const AppBarContext = React.createContext<AppBarProviderProps>({
  height: '',
})

export function AppBarProvider({ children }: { children: React.ReactNode }) {
  const value = React.useMemo(() => ({ height: 'h-[50px]' }), [])

  return (
    <AppBarContext.Provider value={value}>{children}</AppBarContext.Provider>
  )
}
