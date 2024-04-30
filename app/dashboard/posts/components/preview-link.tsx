'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { getPostPath } from '@/lib/utils'
import { usePost } from '../context/post-provider'

export function PreviewLink() {
  const { t } = useTranslation()
  const { post } = usePost()

  return (
    <Link
      href={getPostPath(post) ?? '#'}
      className="text-xs text-blue-700 hover:underline"
    >
      {t('PostList.PreviewLink')}
    </Link>
  )
}
