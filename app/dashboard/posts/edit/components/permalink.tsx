'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { getPostUrl } from '@/lib/utils'
import { usePostForm } from '../context/post-form-provider'

export function Permalink() {
  const [permalink, setPermalink] = React.useState<string>('')

  const { t } = useTranslation()
  const { form, post } = usePostForm()
  const slug = form.watch('slug')

  React.useEffect(() => {
    const url = getPostUrl(post, slug)
    if (url) setPermalink(url)
  }, [post, slug])

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
