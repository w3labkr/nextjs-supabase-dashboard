'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Post } from '@/types/database'
import { siteConfig } from '@/config/site'

interface QuickEditProps {
  post: Post
}

const QuickEdit = ({ post }: QuickEditProps) => {
  const { t } = useTranslation()

  return (
    <Link
      href={`/dashboard/posts/edit?id=${post?.id}`}
      scroll={!siteConfig?.fixedHeader}
      className="text-xs text-blue-700 hover:underline"
    >
      {t('QuickLinks.edit')}
    </Link>
  )
}

export { QuickEdit, type QuickEditProps }
