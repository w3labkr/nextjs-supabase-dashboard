'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { type Post } from '@/types/database'

interface QuickViewProps {
  post: Post
}

const QuickView = ({ post }: QuickViewProps) => {
  const { t } = useTranslation()

  return (
    <Link
      href={post?.permalink ?? '#'}
      className="text-xs text-blue-700 hover:underline dark:text-white"
    >
      {t('view')}
    </Link>
  )
}

export { QuickView, type QuickViewProps }
