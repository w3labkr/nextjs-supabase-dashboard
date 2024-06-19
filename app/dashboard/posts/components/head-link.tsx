'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { usePaging } from '@/components/paging'
import { cn } from '@/lib/utils'
import { PostStatus } from '@/types/database'
import { useQueryString } from '@/hooks/use-query-string'
import { siteConfig } from '@/config/site'

interface HeadLinkProps {
  status: PostStatus | null
  label: PostStatus | 'all'
  count: number
}

const HeadLink = ({ status, label, count }: HeadLinkProps) => {
  const { t } = useTranslation()
  const { qs } = useQueryString()
  const pathname = usePathname()
  const paging = usePaging()

  return (
    <Link
      href={pathname + '?' + qs({ status, page: 1 })}
      scroll={!siteConfig?.fixedHeader}
      className={cn(
        paging?.status === status
          ? 'h-auto p-0 text-foreground'
          : 'h-auto p-0 text-muted-foreground'
      )}
    >
      {t(`${label}`)}({count})
    </Link>
  )
}

export { HeadLink, type HeadLinkProps }
