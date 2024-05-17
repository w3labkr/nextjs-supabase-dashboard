'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { getPostUrl } from '@/lib/utils'
import { usePostForm } from '../post-form-provider'

const Permalink = () => {
  const { t } = useTranslation()
  const {
    form: { watch },
    post,
  } = usePostForm()

  const slug = watch('slug')
  const [permalink, setPermalink] = React.useState<string>('')

  React.useEffect(() => {
    const url = getPostUrl(post, slug)
    if (url) setPermalink(url)
  }, [post, slug])

  return (
    <div className="text-sm">
      {`${t('PostMetabox.permalink')}: `}
      <Link
        href={permalink ?? '#'}
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {decodeURIComponent(permalink)}
      </Link>
    </div>
  )
}

export { Permalink }
