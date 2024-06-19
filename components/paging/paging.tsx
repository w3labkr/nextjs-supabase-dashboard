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
import { siteConfig } from '@/config/site'

interface PagingProps extends React.ComponentProps<'nav'> {}

const Paging = ({ className, ...props }: PagingProps) => {
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
          scroll={!siteConfig?.fixedHeader}
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
        scroll={!siteConfig?.fixedHeader}
        className="p-0"
        iconName="ChevronsLeft"
        text=""
        ariaLabel="Pagination.firstAriaLabel"
        translate="yes"
        ns="components"
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
        scroll={!siteConfig?.fixedHeader}
        className="p-0"
        iconName="ChevronLeft"
        text=""
        ariaLabel="Pagination.previousAriaLabel"
        translate="yes"
        ns="components"
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
        scroll={!siteConfig?.fixedHeader}
        className="p-0"
        iconName="ChevronRight"
        text=""
        ariaLabel="Pagination.nextAriaLabel"
        translate="yes"
        ns="components"
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
        scroll={!siteConfig?.fixedHeader}
        className="p-0"
        iconName="ChevronsRight"
        text=""
        ariaLabel="Pagination.lastAriaLabel"
        translate="yes"
        ns="components"
      />
    </PaginationItem>
  )
}

export { Paging, type PagingProps }
