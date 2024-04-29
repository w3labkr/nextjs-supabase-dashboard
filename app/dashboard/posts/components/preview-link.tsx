'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { absoluteUrl } from '@/lib/utils'
import { usePost } from '../context/post-provider'

export function PreviewLink() {
  const { t } = useTranslation()
  const { post } = usePost()

  const username = post?.profile?.username
  const slug = post?.slug
  const permalink = absoluteUrl(`/${username}/${slug}`)

  return (
    <Link href={permalink} className="text-xs text-blue-700 hover:underline">
      {t('PostList.PreviewLink')}
    </Link>
  )
}
