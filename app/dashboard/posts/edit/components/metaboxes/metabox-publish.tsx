'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
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

import { Post } from '@/types/database'
import { UseFormReturn } from 'react-hook-form'
import { FormValues } from '../../post-form'

interface MetaboxProps {
  form: UseFormReturn<FormValues>
  post: Post | null
}

const MetaboxPublish = (props: MetaboxProps) => {
  const { form, post } = props
  const { t } = useTranslation()

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('PostMetabox.publish')}</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="flex justify-between">
            <DraftButton form={form} post={post} />
            {post?.status === 'draft' ? (
              <PreviewButton form={form} post={post} />
            ) : (
              <ViewButton form={form} post={post} />
            )}
          </div>
          <ul className="space-y-1">
            <li className="flex items-center">
              <LucideIcon name="Signpost" className="mr-2 size-4 min-w-4" />
              {`${t('PostMetabox.status')}: `}
              {post?.status && t(`PostStatus.${post?.status}`)}
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
              {post?.views?.view_count ?? 0}
            </li>
          </ul>
          <div className="flex justify-between">
            <TrashButton form={form} post={post} />
            <PublishButton form={form} post={post} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

const DraftButton = (props: MetaboxProps) => {
  const { form, post } = props
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const { t } = useTranslation()
  const { mutate } = useSWRConfig()

  const onSubmit = async ({ slug, ...formValues }: FormValues) => {
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const slugified = kebabCase(slug)
      const values = { slug: slugified, status: 'draft' }

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({
          formData: Object.assign({}, formValues, values),
          options: { revalidatePaths: getPostPath(post) },
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(fetchUrl)

      toast.success(t('FormMessage.changed_successfully'))
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        form.setError('slug', { message: t('FormMessage.duplicate_slug') })
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
      onClick={form.handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {t('PostMetabox.save_draft')}
    </Button>
  )
}

const ViewButton = (props: MetaboxProps) => {
  const { form, post } = props
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const router = useRouter()
  const { t } = useTranslation()

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
      onClick={form.handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {t('PostMetabox.view')}
    </Button>
  )
}

const PreviewButton = (props: MetaboxProps) => {
  const { form, post } = props
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const router = useRouter()
  const { t } = useTranslation()
  const { mutate } = useSWRConfig()

  const onSubmit = async ({ slug, ...formValues }: FormValues) => {
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const slugified = kebabCase(slug)
      const values = { slug: slugified, status: 'draft' }

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const path = getPostPath(post)
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({
          formData: Object.assign({}, formValues, values),
          options: { revalidatePaths: path },
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(fetchUrl)

      if (path) router.push(path + '?preview=true')
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        form.setError('slug', { message: t('FormMessage.duplicate_slug') })
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
      onClick={form.handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {t('PostMetabox.preview')}
    </Button>
  )
}

const TrashButton = (props: MetaboxProps) => {
  const { form, post } = props
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const router = useRouter()
  const { t } = useTranslation()
  const { unregister } = form

  React.useEffect(() => {
    unregister('slug')
    router.refresh()
  }, [unregister, router])

  const onSubmit = async (formValues: FormValues) => {
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const now = new Date().toISOString()

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({
          formData: {
            user_id: formValues?.user_id,
            status: 'trash',
            deleted_at: now,
          },
          options: { revalidatePaths: getPostPath(post) },
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      toast.success(t('FormMessage.changed_successfully'))

      router.push('/dashboard/posts')
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        form.setError('slug', { message: t('FormMessage.duplicate_slug') })
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
      onClick={form.handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {t('PostMetabox.move_to_trash')}
    </Button>
  )
}

const PublishButton = (props: MetaboxProps) => {
  const { form, post } = props
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const { t } = useTranslation()
  const { mutate } = useSWRConfig()

  const onSubmit = async ({ slug, ...formValues }: FormValues) => {
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const slugified = kebabCase(slug)
      const now = new Date().toISOString()
      const values = { slug: slugified, status: 'publish' }

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({
          formData: post?.published_at
            ? Object.assign({}, formValues, values)
            : Object.assign({}, formValues, values, { published_at: now }),
          options: { revalidatePaths: getPostPath(post) },
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(fetchUrl)

      toast.success(t('FormMessage.changed_successfully'))
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        form.setError('slug', { message: t('FormMessage.duplicate_slug') })
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
      onClick={form.handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {post?.status === 'draft'
        ? t('PostMetabox.publish')
        : t('PostMetabox.update')}
    </Button>
  )
}

export { MetaboxPublish }
