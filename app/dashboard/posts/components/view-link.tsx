'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { getPostPath } from '@/lib/utils'
import { Post } from '@/types/database'

interface ViewLinkProps {
  post: Post
}

const ViewLink = (props: ViewLinkProps) => {
  const { post } = props
  const { t } = useTranslation()

  return (
    <Link
      href={getPostPath(post) ?? '#'}
      className="text-xs text-blue-500 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {t('PostList.ViewLink')}
    </Link>
  )
}

export { ViewLink, type ViewLinkProps }
