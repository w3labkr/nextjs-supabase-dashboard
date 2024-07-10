'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Post } from '@/types/database'

interface QuickViewProps {
  post: Post
}

const QuickView = ({ post }: QuickViewProps) => {
  const { t } = useTranslation()

  const username = post?.author?.username
  const slug = post?.slug

  return (
    <Link
      href={username && slug ? `/${username}/${slug}` : '#'}
      className="text-xs text-blue-700 hover:underline dark:text-white"
      target="_blank"
      rel="noopener noreferrer"
    >
      {t('view')}
    </Link>
  )
}

export { QuickView, type QuickViewProps }
