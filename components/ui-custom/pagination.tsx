'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { ButtonProps, buttonVariants } from '@/components/ui/button'
import { LucideIcon, LucideIconName } from '@/lib/lucide-icon'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
  text?: string
  ariaLabel?: string
  iconName?: LucideIconName
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<typeof Link>

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <Link
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  text = 'Previous',
  ariaLabel = 'Go to previous page',
  iconName = 'ChevronLeft',
  translate,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const { t } = useTranslation()

  return (
    <PaginationLink
      aria-label={translate === 'yes' ? t(ariaLabel) : ariaLabel}
      size="default"
      className={cn('gap-1 pl-2.5', className)}
      {...props}
    >
      {iconName && (
        <LucideIcon name={iconName} className={cn('size-4 min-w-4')} />
      )}
      <span>{translate === 'yes' ? t(text) : text}</span>
    </PaginationLink>
  )
}
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  text = 'Next',
  ariaLabel = 'Go to next page',
  iconName = 'ChevronRight',
  translate,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const { t } = useTranslation()

  return (
    <PaginationLink
      aria-label={translate === 'yes' ? t(ariaLabel) : ariaLabel}
      size="default"
      className={cn('gap-1 pr-2.5', className)}
      {...props}
    >
      <span>{translate === 'yes' ? t(text) : text}</span>
      {iconName && (
        <LucideIcon name={iconName} className={cn('size-4 min-w-4')} />
      )}
    </PaginationLink>
  )
}
PaginationNext.displayName = 'PaginationNext'

type PaginationEllipsisProps = {
  text?: string
  iconName?: LucideIconName
} & React.ComponentProps<'span'>

const PaginationEllipsis = ({
  className,
  text = 'More pages',
  iconName = 'Ellipsis',
  translate,
  ...props
}: PaginationEllipsisProps) => {
  const { t } = useTranslation()

  return (
    <span
      aria-hidden
      className={cn('flex h-9 w-9 items-center justify-center', className)}
      {...props}
    >
      {iconName && (
        <LucideIcon name={iconName} className={cn('size-4 min-w-4')} />
      )}
      <span className="sr-only">{translate === 'yes' ? t(text) : text}</span>
    </span>
  )
}
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
