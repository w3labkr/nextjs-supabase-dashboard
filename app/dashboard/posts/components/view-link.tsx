'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { absoluteUrl } from '@/lib/utils'
import { usePost } from '../context/post-provider'

export function ViewLink() {
  const { t } = useTranslation()
  const { post } = usePost()

  const username = post?.profile?.username
  const slug = post?.slug
  const permalink = absoluteUrl(`/${username}/posts/${slug}`)

  return (
    <Link
      href={permalink}
      className="text-xs text-blue-700 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {t('PostList.ViewLink')}
    </Link>
  )
}
