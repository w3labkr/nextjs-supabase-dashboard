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
import { usePostForm } from '../../context/post-form-provider'

import { useSWRConfig } from 'swr'
import { fetcher, getPostPath } from '@/lib/utils'
import { PostAPI } from '@/types/api'

export function MetaboxPublish() {
  const { t } = useTranslation()
  const { post } = usePostForm()

  const status = post?.status
  const published_at = post?.published_at
  const views = post?.views

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('PostMetabox.publish')}</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="flex justify-between">
            <DraftButton />
            {status === 'draft' ? <PreviewButton /> : <ViewButton />}
          </div>
          <ul className="space-y-1">
            <li className="flex items-center">
              <LucideIcon name="Signpost" className="mr-2 size-4 min-w-4" />
              {`${t('PostMetabox.status')}: `}
              {status && t(`PostStatus.${status}`)}
            </li>
            <li className="flex items-center">
              <LucideIcon name="Eye" className="mr-2 size-4 min-w-4" />
              {`${t('PostMetabox.visibility')}: `}
              {status === 'publish'
                ? t('PostMetabox.public')
                : t('PostMetabox.private')}
            </li>
            <li className="flex items-center">
              <LucideIcon name="CalendarDays" className="mr-2 size-4 min-w-4" />
              {published_at
                ? `${t('PostMetabox.publish_on')}: ${dayjs(published_at).format('YYYY-MM-DD HH:mm')}`
                : `${t('PostMetabox.publish')}: ${t('PostMetabox.immediately')}`}
            </li>
            <li className="flex items-center">
              <LucideIcon name="BarChart" className="mr-2 size-4 min-w-4" />
              {`${t('PostMetabox.post_views')}: `}
              {views === null || views === undefined ? 0 : views}
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

function DraftButton() {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const { t } = useTranslation()
  const { form, post } = usePostForm()
  const { mutate } = useSWRConfig()

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const { slug, ...formValues } = form.getValues()
      const slugified = kebabCase(slug)
      const now = new Date().toISOString()
      const values = { slug: slugified, status: 'draft', updated_at: now }

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({
          formData: Object.assign({}, formValues, values),
          options: { revalidatePath: getPostPath(post) },
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

function ViewButton() {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const router = useRouter()
  const { t } = useTranslation()
  const { form, post } = usePostForm()

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const postPath = getPostPath(post)

      if (postPath) router.push(`${postPath}?preview=true`)
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
      {t('PostMetabox.preview')}
    </Button>
  )
}

function PreviewButton() {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const router = useRouter()
  const { t } = useTranslation()
  const { form, post } = usePostForm()
  const { mutate } = useSWRConfig()

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const { slug, ...formValues } = form.getValues()
      const slugified = kebabCase(slug)
      const now = new Date().toISOString()
      const values = { slug: slugified, status: 'draft', updated_at: now }

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const postPath = getPostPath(post)
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({
          formData: Object.assign({}, formValues, values),
          options: { revalidatePath: postPath },
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(fetchUrl)

      if (postPath) router.push(postPath + '?preview=true')
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

function TrashButton() {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const router = useRouter()
  const { t } = useTranslation()
  const { form, post } = usePostForm()
  const { unregister } = form

  React.useEffect(() => {
    unregister('slug')
    router.refresh()
  }, [unregister, router])

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const now = new Date().toISOString()

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({
          formData: { status: 'trash', deleted_at: now },
          options: { revalidatePath: getPostPath(post) },
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

function PublishButton() {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const { t } = useTranslation()
  const { form, post } = usePostForm()
  const { mutate } = useSWRConfig()

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const { slug, ...formValues } = form.getValues()
      const slugified = kebabCase(slug)
      const now = new Date().toISOString()
      const values = { slug: slugified, status: 'publish', updated_at: now }

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({
          formData: post?.published_at
            ? Object.assign({}, formValues, values)
            : Object.assign({}, formValues, values, { publish_at: now }),
          options: { revalidatePath: getPostPath(post) },
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
