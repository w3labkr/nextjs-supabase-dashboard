'use client'

import * as React from 'react'

import { type Post } from '@/types/database'

interface BulkActionsContextProps {
  checks: Post[]
  setChecks: React.Dispatch<React.SetStateAction<Post[]>>
}

const BulkActionsContext = React.createContext<
  BulkActionsContextProps | undefined
>({
  checks: [],
  setChecks: () => void 0,
})

const BulkActionsProvider = ({ children }: { children?: React.ReactNode }) => {
  const [checks, setChecks] = React.useState<Post[]>([])

  return (
    <BulkActionsContext.Provider value={{ checks, setChecks }}>
      {children}
    </BulkActionsContext.Provider>
  )
}

const useBulkActions = () => {
  const context = React.useContext<BulkActionsContextProps | undefined>(
    BulkActionsContext
  )

  if (context === undefined) {
    throw new Error('useBulkActions must be used within BulkActionsProvider')
  }

  return context
}

export { BulkActionsProvider, useBulkActions }
