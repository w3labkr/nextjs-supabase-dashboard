'use client'

import * as React from 'react'

export interface AppBarContextProps {
  height: string | null
}

export const AppBarContext = React.createContext<AppBarContextProps>({
  height: null,
})

export function AppBarProvider({ children }: { children: React.ReactNode }) {
  const value = React.useMemo(() => ({ height: 'h-[50px]' }), [])

  return (
    <AppBarContext.Provider value={value}>{children}</AppBarContext.Provider>
  )
}
