'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { type Post } from '@/types/database'

interface QuickEditProps {
  post: Post
}

const QuickEdit = ({ post }: QuickEditProps) => {
  const { t } = useTranslation()

  return (
    <Link
      href={`/dashboard/posts/edit?id=${post?.id}`}
      className="text-xs text-blue-700 hover:underline dark:text-white"
    >
      {t('edit')}
    </Link>
  )
}

export { QuickEdit, type QuickEditProps }
