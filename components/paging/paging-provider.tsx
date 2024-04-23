'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'

interface PagingContextProps {
  page: number
  perPage: number
  pageSize: number
  status: string
}

const PagingContext = React.createContext<PagingContextProps | undefined>(
  undefined
)

export function PagingProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()

  const page = +(searchParams.get('page') ?? '1')
  const perPage = +(searchParams.get('perPage') ?? '50')
  const pageSize = +(searchParams.get('pageSize') ?? '10')
  const status = searchParams.get('status') ?? 'all'

  const value = React.useMemo(() => {
    return {
      page,
      perPage,
      pageSize,
      status,
    }
  }, [page, perPage, pageSize, status])

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
