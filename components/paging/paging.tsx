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

interface PagingProps extends React.ComponentProps<'nav'> {}

const Paging = (props: PagingProps) => {
  const { className, ...rest } = props

  return (
    <Pagination className={className} {...rest}>
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

const PagingItem = () => {
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

const FirstItem = () => {
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

const PreviousItem = () => {
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

const NextItem = () => {
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

const LastItem = () => {
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

export { Paging, type PagingProps }
