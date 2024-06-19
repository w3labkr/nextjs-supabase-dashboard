'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useFormContext, useWatch } from 'react-hook-form'

import { getPostUrl } from '@/lib/utils'
import { siteConfig } from '@/config/site'
import { usePostForm } from '@/app/dashboard/posts/edit/context/post-form-provider'

const Permalink = () => {
  const { t } = useTranslation()
  const { post } = usePostForm()
  const { control } = useFormContext()

  const watchSlug: string = useWatch({ control, name: 'slug' })
  const [permalink, setPermalink] = React.useState<string>('')

  React.useEffect(() => {
    const url = getPostUrl(post, { slug: watchSlug })
    if (url) setPermalink(url)
  }, [post, watchSlug])

  return (
    <div className="text-sm">
      {`${t('permalink')}: `}
      <Link
        href={permalink ?? '#'}
        scroll={!siteConfig?.fixedHeader}
        className="text-blue-700 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {decodeURIComponent(permalink)}
      </Link>
    </div>
  )
}

export { Permalink }
