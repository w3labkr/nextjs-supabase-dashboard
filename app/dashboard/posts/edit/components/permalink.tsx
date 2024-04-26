'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { absoluteUrl } from '@/lib/utils'
import { usePostForm } from './post-form-provider'

export function Permalink() {
  const { t } = useTranslation()
  const { form, post } = usePostForm()

  const username = post?.profile?.username
  const slug = form.watch('slug')
  const permalink = React.useMemo(() => {
    return absoluteUrl(`/${username}/${slug}`)
  }, [username, slug])

  return (
    <div className="text-sm">
      {`${t('PostMetabox.permalink')}: `}
      <Link
        href={permalink}
        className="text-blue-700 underline-offset-4 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {decodeURIComponent(permalink)}
      </Link>
    </div>
  )
}
