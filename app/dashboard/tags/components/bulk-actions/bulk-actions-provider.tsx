'use client'

import * as React from 'react'

import { type Tag } from '@/types/database'

interface BulkActionsContextProps {
  checks: Tag[]
  setChecks: React.Dispatch<React.SetStateAction<Tag[]>>
}

const BulkActionsContext = React.createContext<
  BulkActionsContextProps | undefined
>({
  checks: [],
  setChecks: () => void 0,
})

const BulkActionsProvider = ({ children }: { children?: React.ReactNode }) => {
  const [checks, setChecks] = React.useState<Tag[]>([])

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
