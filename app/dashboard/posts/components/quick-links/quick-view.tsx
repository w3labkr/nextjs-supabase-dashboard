'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { getPostPath } from '@/lib/utils'
import { Post } from '@/types/database'
import { siteConfig } from '@/config/site'

interface QuickViewProps {
  post: Post
}

const QuickView = ({ post }: QuickViewProps) => {
  const { t } = useTranslation()

  return (
    <Link
      href={getPostPath(post) ?? '#'}
      scroll={!siteConfig?.fixedHeader}
      className="text-xs text-blue-700 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {t('QuickLinks.view')}
    </Link>
  )
}

export { QuickView, type QuickViewProps }
