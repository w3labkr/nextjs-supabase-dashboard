'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Post } from '@/types/database'

interface EditLinkProps {
  post: Post
}

const EditLink = (props: EditLinkProps) => {
  const { post } = props
  const { t } = useTranslation()

  return (
    <Link
      href={`/dashboard/posts/edit?id=${post?.id}`}
      className="text-xs text-blue-700 hover:underline"
    >
      {t('PostList.EditLink')}
    </Link>
  )
}

export { EditLink, type EditLinkProps }
