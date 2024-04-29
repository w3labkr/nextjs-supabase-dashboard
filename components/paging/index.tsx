'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui-custom/pagination'

import { usePaging } from './paging-provider'
import { useQueryString } from '@/hooks/use-query-string'

export function Paging({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <Pagination className={className} {...props}>
      <PaginationContent>
        <FirstItem />
        <PreviousItem />
        <PagingItem />
        <NextItem />
        <LastItem />
      </PaginationContent>
    </Pagination>
  )
}

function PagingItem() {
  const { pageSize, startPage, page } = usePaging()
  const { qs } = useQueryString()
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

function FirstItem() {
  const { currentSet, firstPage } = usePaging()
  const { qs } = useQueryString()
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

function PreviousItem() {
  const { currentSet, previousPage } = usePaging()
  const { qs } = useQueryString()
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

function NextItem() {
  const { totalSet, currentSet, nextPage } = usePaging()
  const { qs } = useQueryString()
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

function LastItem() {
  const { totalSet, currentSet, lastPage } = usePaging()
  const { qs } = useQueryString()
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