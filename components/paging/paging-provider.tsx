'use client'

import * as React from 'react'

interface PagingContextProps {
  page: number
  perPage: number
  pageSize: number
  status: string
  setPage: React.Dispatch<React.SetStateAction<number>>
  setPerPage: React.Dispatch<React.SetStateAction<number>>
  setPageSize: React.Dispatch<React.SetStateAction<number>>
  setStatus: React.Dispatch<React.SetStateAction<string>>
}

const PagingContext = React.createContext<PagingContextProps | undefined>(
  undefined
)

export function PagingProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = React.useState<number>(1)
  const [perPage, setPerPage] = React.useState<number>(50)
  const [pageSize, setPageSize] = React.useState<number>(10)
  const [status, setStatus] = React.useState<string>('all')

  const value = React.useMemo(() => {
    return {
      page,
      perPage,
      pageSize,
      status,
      setPage,
      setPerPage,
      setPageSize,
      setStatus,
    }
  }, [
    page,
    perPage,
    pageSize,
    status,
    setPage,
    setPerPage,
    setPageSize,
    setStatus,
  ])

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
