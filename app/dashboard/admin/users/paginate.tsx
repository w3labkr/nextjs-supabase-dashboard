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

interface PagingProps {
  page: number // Current page number
  perPage: number // Number of posts to display per page
  setPage: React.Dispatch<React.SetStateAction<number>>
  total: number // Total number of posts
  pageSize?: number // Number of page buttons to display
}

const Paging = ({
  page = 1,
  perPage = 50,
  setPage,
  total = 0,
  pageSize = 10,
}: PagingProps) => {
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

  return (
    <Pagination>
      <PaginationContent>
        {currentSet > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className="p-0"
              iconName="ChevronsLeft"
              text=""
              ariaLabel="Pagination.firstAriaLabel"
              translate="yes"
              ns="components"
              onClick={() => setPage(firstPage)}
            />
          </PaginationItem>
        )}
        {currentSet > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className="p-0"
              iconName="ChevronLeft"
              text=""
              ariaLabel="Pagination.previousAriaLabel"
              translate="yes"
              ns="components"
              onClick={() => setPage(previousPage)}
            />
          </PaginationItem>
        )}
        {Array(pageSize)
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
          ))}
        {totalSet > currentSet && (
          <PaginationItem>
            <PaginationNext
              href="#"
              className="p-0"
              iconName="ChevronRight"
              text=""
              ariaLabel="Pagination.nextAriaLabel"
              translate="yes"
              ns="components"
              onClick={() => setPage(nextPage)}
            />
          </PaginationItem>
        )}
        {totalSet > currentSet && (
          <PaginationItem>
            <PaginationNext
              href="#"
              className="p-0"
              iconName="ChevronsRight"
              text=""
              ariaLabel="Pagination.lastAriaLabel"
              translate="yes"
              ns="components"
              onClick={() => setPage(lastPage)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

export { Paging, type PagingProps }
