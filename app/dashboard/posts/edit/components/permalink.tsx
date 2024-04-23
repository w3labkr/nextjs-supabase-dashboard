'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { absoluteUrl } from '@/lib/utils'
import { usePostForm } from './post-form-provider'

export function Permalink() {
  const { t } = useTranslation()
  const { form, post } = usePostForm()

  const slug = form.watch('slug')
  const username = post?.profile?.username ?? ''
  const [permalink, setPermalink] = React.useState<string>('')

  React.useEffect(() => {
    const pathname = `${username}/posts/${slug}`
    const url = absoluteUrl(pathname)
    setPermalink(url)
  }, [username, slug])

  return (
    <div className="text-sm">
      {`${t('PostMetabox.permalink')}: `}
      <Link href={permalink} className="text-blue-700" target="_blank">
        {decodeURIComponent(permalink)}
      </Link>
    </div>
  )
}
