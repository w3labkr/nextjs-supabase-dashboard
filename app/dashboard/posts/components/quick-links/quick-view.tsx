'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { getPostPath } from '@/lib/utils'
import { Post } from '@/types/database'

interface QuickViewProps {
  post: Post
}

const QuickView = (props: QuickViewProps) => {
  const { post } = props
  const { t } = useTranslation()

  return (
    <Link
      href={getPostPath(post) ?? '#'}
      className="text-xs text-blue-700 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {t('QuickLinks.view')}
    </Link>
  )
}

export { QuickView, type QuickViewProps }
