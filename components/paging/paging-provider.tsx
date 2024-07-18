'use client'

import * as React from 'react'

interface PagingContextProps {
  perPage: number
  page: number
  pageSize: number
  total: number
  [key: string]: any
}

const PagingContext = React.createContext<PagingContextProps | undefined>(
  undefined
)

const PagingProvider = ({
  children,
  value,
}: {
  children?: React.ReactNode
  value: PagingContextProps
}) => {
  const memoValue = React.useMemo(() => {
    let { total, page, pageSize, perPage, ...rest } = value

    if (page < 1) page = 1

    // A number indicating which set the current button belongs to
    const currentSet = Math.ceil(page / pageSize)

    // Number of the first page
    const firstPage = 1

    // Number of the last page
    const lastPage = Math.ceil(total / perPage)

    // First button number to be currently displayed
    const startPage = (currentSet - 1) * pageSize + 1

    // Number of the last currently visible button
    const endPage = startPage + pageSize - 1

    // Number of the previous page
    const previousPage = startPage - 1 < firstPage ? firstPage : startPage - 1

    // Number of the next page
    const nextPage = endPage + 1 > lastPage ? lastPage : endPage + 1

    // Total number of button sets
    const totalSet = Math.ceil(lastPage / pageSize)

    // Starting post number
    const startPost = (page - 1) * perPage + 1

    // Last post number
    const endPost = startPost + perPage - 1

    // Number of the exceed page
    const exceedPage = endPage - lastPage

    // Modify to fit page size
    if (exceedPage > 0) pageSize = pageSize - exceedPage
    if (pageSize > lastPage) pageSize = lastPage
    if (pageSize < 1) pageSize = firstPage

    return {
      total,
      page,
      perPage,
      pageSize,
      currentSet,
      totalSet,
      firstPage,
      lastPage,
      startPage,
      endPage,
      previousPage,
      nextPage,
      startPost,
      endPost,
      exceedPage,
      ...rest,
    }
  }, [value])

  return (
    <PagingContext.Provider value={memoValue}>
      {children}
    </PagingContext.Provider>
  )
}

const usePaging = () => {
  const context = React.useContext<PagingContextProps | undefined>(
    PagingContext
  )

  if (context === undefined) {
    throw new Error('usePaging must be used within PagingProvider')
  }

  return context
}

export { PagingProvider, usePaging, type PagingContextProps }
