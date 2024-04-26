'use client'

import * as React from 'react'

interface PagingContextProps {
  page: number
  perPage: number
  pageSize: number
  [key: string]: any
}

const PagingContext = React.createContext<PagingContextProps | undefined>(
  undefined
)

export function PagingProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: PagingContextProps
}) {
  return (
    <PagingContext.Provider value={value}>{children}</PagingContext.Provider>
  )
}

export function usePaging() {
  const context = React.useContext<PagingContextProps | undefined>(
    PagingContext
  )

  if (context === undefined) {
    throw new Error('usePaging must be used within PagingProvider')
  }

  return context
}
