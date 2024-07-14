'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useFormContext, useWatch } from 'react-hook-form'

import { usePostForm } from '@/app/dashboard/posts/edit/context/post-form-provider'
import { absoluteUrl } from '@/lib/utils'
import { Input } from '@/components/ui/input'

interface MetaboxPermalinkProps extends React.HTMLAttributes<HTMLDivElement> {}

const MetaboxPermalink = ({ className, ...props }: MetaboxPermalinkProps) => {
  const { t } = useTranslation()
  const { post } = usePostForm()
  const { control, register, setValue } = useFormContext()

  const watchSlug: string = useWatch({ control, name: 'slug' })
  const watchPermalink: string = useWatch({ control, name: 'permalink' })

  React.useEffect(() => {
    const username = post?.author?.username
    const slug = watchSlug ?? post?.slug
    const url = username && slug ? absoluteUrl(`/${username}/${slug}`) : ''
    setValue('permalink', url, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }, [post, watchSlug, setValue])

  return (
    <div className={className} {...props}>
      <Input type="hidden" {...register('permalink')} />
      {t('permalink') + ': '}
      <Link
        href={watchPermalink ?? '#'}
        className="text-blue-700 underline hover:no-underline dark:text-white"
        target="_blank"
      >
        {decodeURIComponent(watchPermalink)}
      </Link>
    </div>
  )
}

export { MetaboxPermalink }
