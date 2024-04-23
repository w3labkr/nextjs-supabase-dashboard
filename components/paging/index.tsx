'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

import { qs } from '@/lib/utils'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui-custom/pagination'
import { usePaging } from '@/components/paging/paging-provider'

interface Calculate {
  page: number
  perPage: number
  pageSize: number
  currentSet: number
  totalSet: number
  firstPage: number
  lastPage: number
  startPage: number
  endPage: number
  previousPage: number
  nextPage: number
  startPost: number
  endPost: number
  exceedPage: number
}

export function Paging({ total = 0 }: { total: number }) {
  const calculate = useCalculate(total)

  return (
    <Pagination>
      <PaginationContent>
        <FirstItem calculate={calculate} />
        <PreviousItem calculate={calculate} />
        <PagingItem calculate={calculate} />
        <NextItem calculate={calculate} />
        <LastItem calculate={calculate} />
      </PaginationContent>
    </Pagination>
  )
}

function PagingItem({ calculate }: { calculate: Calculate }) {
  const { pageSize, startPage, page } = calculate
  const pathname = usePathname()

  return Array(pageSize)
    .fill(startPage)
    .map((_, i) => (
      <PaginationItem key={i}>
        <PaginationLink
          href={pathname + '?' + qs({ page: startPage + i })}
          isActive={page === startPage + i}
        >
          {startPage + i}
        </PaginationLink>
      </PaginationItem>
    ))
}

function FirstItem({ calculate }: { calculate: Calculate }) {
  const { currentSet, firstPage } = calculate
  const pathname = usePathname()

  if (currentSet > 1 === false) return null

  return (
    <PaginationItem>
      <PaginationPrevious
        href={pathname + '?' + qs({ page: firstPage })}
        text=""
        className="p-0"
        iconName="ChevronsLeft"
        ariaLabel="Pagination.firstAriaLabel"
        translate="yes"
      />
    </PaginationItem>
  )
}

function PreviousItem({ calculate }: { calculate: Calculate }) {
  const { currentSet, previousPage } = calculate
  const pathname = usePathname()

  if (currentSet > 1 === false) return null

  return (
    <PaginationItem>
      <PaginationPrevious
        href={pathname + '?' + qs({ page: previousPage })}
        text=""
        className="p-0"
        iconName="ChevronLeft"
        ariaLabel="Pagination.previousAriaLabel"
        translate="yes"
      />
    </PaginationItem>
  )
}

function NextItem({ calculate }: { calculate: Calculate }) {
  const { totalSet, currentSet, nextPage } = calculate
  const pathname = usePathname()

  if (totalSet > currentSet === false) return null

  return (
    <PaginationItem>
      <PaginationNext
        href={pathname + '?' + qs({ page: nextPage })}
        text=""
        iconName="ChevronRight"
        className="p-0"
        ariaLabel="Pagination.nextAriaLabel"
        translate="yes"
      />
    </PaginationItem>
  )
}

function LastItem({ calculate }: { calculate: Calculate }) {
  const { totalSet, currentSet, lastPage } = calculate
  const pathname = usePathname()

  if (totalSet > currentSet === false) return null

  return (
    <PaginationItem>
      <PaginationNext
        href={pathname + '?' + qs({ page: lastPage })}
        text=""
        className="p-0"
        iconName="ChevronsRight"
        ariaLabel="Pagination.lastAriaLabel"
        translate="yes"
      />
    </PaginationItem>
  )
}

function useCalculate(total: number = 0) {
  const {
    page: oldPage,
    perPage: oldPerPage,
    pageSize: oldPageSize,
  } = usePaging()

  const values = React.useMemo(() => {
    let page = oldPage
    let pageSize = oldPageSize
    let perPage = oldPerPage

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
    }
  }, [oldPage, oldPerPage, oldPageSize, total])

  return values
}
