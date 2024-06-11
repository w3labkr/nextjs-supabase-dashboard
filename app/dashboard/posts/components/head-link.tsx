'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { usePaging } from '@/components/paging'
import { cn, setUrn } from '@/lib/utils'
import { PostStatus } from '@/types/database'
import { useQueryString } from '@/hooks/use-query-string'

interface HeadLinkProps {
  status: PostStatus | null
  label: PostStatus | 'all'
  count: number
}

const HeadLink = (props: HeadLinkProps) => {
  const { status, label, count } = props
  const { t } = useTranslation()
  const { qs } = useQueryString()
  const pathname = usePathname()
  const paging = usePaging()

  return (
    <Link
      href={setUrn(pathname, qs({ status: status ?? '', page: 1 }))}
      className={cn(
        'h-auto p-0',
        paging?.status === status ? 'text-foreground' : 'text-muted-foreground'
      )}
    >
      {t(`PostStatus.${label}`)}({count})
    </Link>
  )
}

export { HeadLink, type HeadLinkProps }
