'use client'

import * as React from 'react'

interface AppBarContextProps {
  height: string
}

const AppBarContext = React.createContext<AppBarContextProps | undefined>(
  undefined
)

function AppBarProvider({ children }: { children: React.ReactNode }) {
  const memoValue = React.useMemo(() => ({ height: 'h-[50px]' }), [])

  return (
    <AppBarContext.Provider value={memoValue}>
      {children}
    </AppBarContext.Provider>
  )
}

function useAppBar() {
  const context = React.useContext<AppBarContextProps | undefined>(
    AppBarContext
  )

  if (context === undefined) {
    throw new Error('useAppBar must be used within AppBarProvider')
  }

  return context
}

export { AppBarProvider, useAppBar }
