'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { UseFormReturn } from 'react-hook-form'
import { FormValues } from '../post-form'

import { getPostUrl } from '@/lib/utils'
import { Post } from '@/types/database'

export function Permalink({
  form,
  post,
}: {
  form: UseFormReturn<FormValues>
  post: Post | null
}) {
  const [permalink, setPermalink] = React.useState<string>('')
  const { t } = useTranslation()

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
