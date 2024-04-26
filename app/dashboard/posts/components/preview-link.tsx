'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { absoluteUrl } from '@/lib/utils'
import { usePostItem } from '../context/post-item-provider'

export function PreviewLink() {
  const { t } = useTranslation()
  const { post } = usePostItem()

  const username = post?.profile?.username
  const slug = post?.slug
  const permalink = React.useMemo(() => {
    return absoluteUrl(`/${username}/${slug}`)
  }, [username, slug])

  return (
    <Link href={permalink} className="text-xs text-blue-700 hover:underline">
      {t('PostList.PreviewLink')}
    </Link>
  )
}
