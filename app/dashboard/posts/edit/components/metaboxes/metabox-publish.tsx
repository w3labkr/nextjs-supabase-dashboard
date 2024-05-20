'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { kebabCase } from 'lodash'
import dayjs from 'dayjs'

import { toast } from 'sonner'
import { LucideIcon } from '@/lib/lucide-icon'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

import { useSWRConfig } from 'swr'
import { fetcher, getPostPath } from '@/lib/utils'
import { PostAPI } from '@/types/api'
import { usePostForm } from '../../post-form-provider'

const MetaboxPublish = () => {
  const { t } = useTranslation()
  const { post } = usePostForm()

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger className="pt-0">
          {t('PostMetabox.publish')}
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="flex justify-between">
            <DraftButton />
            {post?.status === 'draft' ? <PreviewButton /> : <ViewButton />}
          </div>
          <ul className="space-y-1">
            <li className="flex items-center">
              <LucideIcon name="Signpost" className="mr-2 size-4 min-w-4" />
              {`${t('PostMetabox.status')}: `}
              {post?.status === 'private'
                ? t('PostMetabox.publish')
                : t(`PostStatus.${post?.status}`)}
            </li>
            <li className="flex items-center">
              <LucideIcon name="Eye" className="mr-2 size-4 min-w-4" />
              {`${t('PostMetabox.visibility')}: `}
              {post?.status === 'publish'
                ? t('PostMetabox.public')
                : t('PostMetabox.private')}
            </li>
            <li className="flex items-center">
              <LucideIcon name="CalendarDays" className="mr-2 size-4 min-w-4" />
              {post?.published_at
                ? `${t('PostMetabox.publish_on')}: ${dayjs(post?.published_at).format('YYYY-MM-DD HH:mm')}`
                : `${t('PostMetabox.publish')}: ${t('PostMetabox.immediately')}`}
            </li>
            <li className="flex items-center">
              <LucideIcon name="BarChart" className="mr-2 size-4 min-w-4" />
              {`${t('PostMetabox.post_views')}: `}
              {post?.meta?.view_count ?? '0'}
            </li>
          </ul>
          <div className="flex justify-between">
            <TrashButton />
            <PublishButton />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

const DraftButton = () => {
  const { t } = useTranslation()
  const { mutate } = useSWRConfig()
  const { getValues, setError, handleSubmit } = useFormContext()
  const { post } = usePostForm()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const { slug, ...formValues } = getValues()
      const fetchData = {
        ...formValues,
        slug: kebabCase(slug),
        status: 'draft',
      }

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const fetchOptions = { revalidatePaths: getPostPath(post) }
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({ data: fetchData, options: fetchOptions }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(fetchUrl)

      toast.success(t('FormMessage.changed_successfully'))
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        setError('slug', { message: t('FormMessage.duplicate_slug') })
      } else {
        toast.error(err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {t('PostMetabox.save_draft')}
    </Button>
  )
}

const ViewButton = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { handleSubmit } = useFormContext()
  const { post } = usePostForm()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const path = getPostPath(post)

      if (path) router.push(path)
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {t('PostMetabox.view')}
    </Button>
  )
}

const PreviewButton = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { mutate } = useSWRConfig()
  const { getValues, setError, handleSubmit } = useFormContext()
  const { post } = usePostForm()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const path = getPostPath(post)
      const { slug, ...formValues } = getValues()
      const fetchData = {
        ...formValues,
        slug: kebabCase(slug),
        status: 'draft',
      }

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const fetchOptions = { revalidatePaths: path }
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({ data: fetchData, options: fetchOptions }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(fetchUrl)

      if (path) router.push(path + '?preview=true')
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        setError('slug', { message: t('FormMessage.duplicate_slug') })
      } else {
        toast.error(err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {t('PostMetabox.preview')}
    </Button>
  )
}

const TrashButton = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { getValues, setError, handleSubmit, unregister } = useFormContext()
  const { post } = usePostForm()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  React.useEffect(() => {
    unregister('slug')
    router.refresh()
  }, [unregister, router])

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const { user_id } = getValues()
      const fetchData = {
        user_id,
        status: 'trash',
        deleted_at: new Date().toISOString(),
      }

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const fetchOptions = { revalidatePaths: getPostPath(post) }
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({ data: fetchData, options: fetchOptions }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      toast.success(t('FormMessage.changed_successfully'))

      router.push('/dashboard/posts')
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        setError('slug', { message: t('FormMessage.duplicate_slug') })
      } else {
        toast.error(err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="link"
      className="h-auto p-0 text-destructive underline"
      size="sm"
      onClick={handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {t('PostMetabox.move_to_trash')}
    </Button>
  )
}

const PublishButton = () => {
  const { t } = useTranslation()
  const { mutate } = useSWRConfig()
  const { getValues, setError, handleSubmit } = useFormContext()
  const { post } = usePostForm()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const { slug, status, ...formValues } = getValues()

      const published = {
        ...formValues,
        slug: kebabCase(slug),
        status: status === 'private' ? 'private' : 'publish',
        published_at: new Date().toISOString(),
      }

      const updated = {
        ...formValues,
        slug: kebabCase(slug),
        status: status === 'private' ? 'private' : 'publish',
      }

      const fetchData = post?.published_at ? updated : published

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const fetchOptions = { revalidatePaths: getPostPath(post) }
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({ data: fetchData, options: fetchOptions }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(fetchUrl)

      toast.success(t('FormMessage.changed_successfully'))
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        setError('slug', { message: t('FormMessage.duplicate_slug') })
      } else {
        toast.error(err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="submit"
      variant="default"
      size="sm"
      onClick={handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {post?.status === 'draft'
        ? t('PostMetabox.publish')
        : t('PostMetabox.update')}
    </Button>
  )
}

export { MetaboxPublish }
