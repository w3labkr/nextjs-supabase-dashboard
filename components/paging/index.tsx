'use client'

import * as React from 'react'

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

interface NewPaging {
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
  const paging = useNewPaging(total)

  return (
    <Pagination>
      <PaginationContent>
        <FirstItem paging={paging} />
        <PreviousItem paging={paging} />
        <PagingItem paging={paging} />
        <NextItem paging={paging} />
        <LastItem paging={paging} />
      </PaginationContent>
    </Pagination>
  )
}

function PagingItem({ paging }: { paging: NewPaging }) {
  const { setPage } = usePaging()
  const { pageSize, startPage, page } = paging

  return Array(pageSize)
    .fill(startPage)
    .map((_, i) => (
      <PaginationItem key={i}>
        <PaginationLink
          href="#"
          onClick={() => setPage(startPage + i)}
          isActive={page === startPage + i}
        >
          {startPage + i}
        </PaginationLink>
      </PaginationItem>
    ))
}

function FirstItem({ paging }: { paging: NewPaging }) {
  const { setPage } = usePaging()
  const { currentSet, firstPage } = paging

  if (currentSet > 1 === false) return null

  return (
    <PaginationItem>
      <PaginationPrevious
        href="#"
        text=""
        className="p-0"
        iconName="ChevronsLeft"
        ariaLabel="Pagination.firstAriaLabel"
        translate="yes"
        onClick={() => setPage(firstPage)}
      />
    </PaginationItem>
  )
}

function PreviousItem({ paging }: { paging: NewPaging }) {
  const { setPage } = usePaging()
  const { currentSet, previousPage } = paging

  if (currentSet > 1 === false) return null

  return (
    <PaginationItem>
      <PaginationPrevious
        href="#"
        text=""
        className="p-0"
        iconName="ChevronLeft"
        ariaLabel="Pagination.previousAriaLabel"
        translate="yes"
        onClick={() => setPage(previousPage)}
      />
    </PaginationItem>
  )
}

function NextItem({ paging }: { paging: NewPaging }) {
  const { setPage } = usePaging()
  const { totalSet, currentSet, nextPage } = paging

  if (totalSet > currentSet === false) return null

  return (
    <PaginationItem>
      <PaginationNext
        href="#"
        text=""
        iconName="ChevronRight"
        className="p-0"
        ariaLabel="Pagination.nextAriaLabel"
        translate="yes"
        onClick={() => setPage(nextPage)}
      />
    </PaginationItem>
  )
}

function LastItem({ paging }: { paging: NewPaging }) {
  const { setPage } = usePaging()
  const { totalSet, currentSet, lastPage } = paging

  if (totalSet > currentSet === false) return null

  return (
    <PaginationItem>
      <PaginationNext
        href="#"
        text=""
        className="p-0"
        iconName="ChevronsRight"
        ariaLabel="Pagination.lastAriaLabel"
        translate="yes"
        onClick={() => setPage(lastPage)}
      />
    </PaginationItem>
  )
}

function useNewPaging(total: number = 0) {
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

  return { ...values }
}
