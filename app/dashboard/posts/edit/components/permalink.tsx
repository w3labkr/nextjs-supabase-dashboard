'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useFormContext, useWatch } from 'react-hook-form'

import { usePostForm } from '@/app/dashboard/posts/edit/context/post-form-provider'
import { absoluteUrl } from '@/lib/utils'

interface PermalinkProps extends React.HTMLAttributes<HTMLDivElement> {}

const Permalink = ({ className, ...props }: PermalinkProps) => {
  const { t } = useTranslation()
  const { post } = usePostForm()
  const { control } = useFormContext()

  const watchSlug: string = useWatch({ control, name: 'slug' })
  const [permalink, setPermalink] = React.useState<string>('')

  React.useEffect(() => {
    const username = post?.author?.username
    const slug = watchSlug ?? post?.slug
    const url = username && slug ? absoluteUrl(`/${username}/${slug}`) : null
    if (url) setPermalink(url)
  }, [post, watchSlug])

  return (
    <div className={className} {...props}>
      {t('permalink') + ': '}
      <Link
        href={permalink ?? '#'}
        className="text-blue-700 underline hover:no-underline dark:text-white"
        target="_blank"
        rel="noopener noreferrer"
      >
        {decodeURIComponent(permalink)}
      </Link>
    </div>
  )
}

export { Permalink }
