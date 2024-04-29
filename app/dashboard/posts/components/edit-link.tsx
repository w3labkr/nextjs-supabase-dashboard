'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { usePost } from '../context/post-provider'

export function EditLink() {
  const { t } = useTranslation()
  const { post } = usePost()

  return (
    <Link
      href={`/dashboard/posts/edit?id=${post?.id}`}
      className="text-xs text-blue-700 hover:underline"
    >
      {t('PostList.EditLink')}
    </Link>
  )
}
