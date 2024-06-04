'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Post } from '@/types/database'

interface EditPostProps {
  post: Post
}

const EditPost = (props: EditPostProps) => {
  const { post } = props
  const { t } = useTranslation()

  return (
    <Link
      href={`/dashboard/posts/edit?id=${post?.id}`}
      className="text-xs text-blue-700 hover:underline"
    >
      {t('PostList.EditPost')}
    </Link>
  )
}

export { EditPost, type EditPostProps }
