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

import useSWRMutation from 'swr/mutation'
import { fetcher } from '@/lib/utils'
import { usePostForm } from '../post-form-provider'

async function sendRequest(url: string, { arg }: { arg: any }) {
  return await fetcher(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  })
}

export function MetaboxPublish() {
  const { t } = useTranslation()
  const { post } = usePostForm()

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('PostMetabox.publish')}</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="flex justify-between">
            <DraftButton />
            <PreviewButton />
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
              {post?.views != null && post?.views}
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
  const { t } = useTranslation()
  const { form, post } = usePostForm()

  const { trigger } = useSWRMutation(
    post?.id ? `/api/v1/post/${post?.id}` : null,
    sendRequest
  )
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      const user_id = post?.user_id
      if (!user_id) throw new Error('Require is not defined.')

      const formValues = form.getValues()
      const slug = kebabCase(formValues.slug)
      const values = { ...formValues, slug, user_id, status: 'draft' }

      const result = await trigger(values)
      if (result?.error) throw new Error(result?.error?.message)

      toast.success(t('FormMessage.changed_successfully'))
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        form.setError('slug', { message: t('FormMessage.duplicate_slug') })
      } else {
        toast.error((e as Error)?.message)
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

function PreviewButton() {
  const { t } = useTranslation()
  const { form, post } = usePostForm()

  const { trigger } = useSWRMutation(
    post?.id ? `/api/v1/post/${post?.id}` : null,
    sendRequest
  )
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      const user_id = post?.user_id
      if (!user_id) throw new Error('Require is not defined.')

      const formValues = form.getValues()
      const slug = kebabCase(formValues.slug)
      const values = { ...formValues, slug, user_id, status: 'draft' }

      const result = await trigger(values)
      if (result?.error) throw new Error(result?.error?.message)

      toast.success(t('FormMessage.changed_successfully'))
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        form.setError('slug', { message: t('FormMessage.duplicate_slug') })
      } else {
        toast.error((e as Error)?.message)
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
      // disabled={isSubmitting}
      disabled
    >
      {t('PostMetabox.preview')}
    </Button>
  )
}

function TrashButton() {
  const router = useRouter()
  const { t } = useTranslation()

  const { form, post } = usePostForm()
  const { unregister } = form
  const { trigger } = useSWRMutation(
    post?.id ? `/api/v1/post/${post?.id}` : null,
    sendRequest
  )

  React.useEffect(() => {
    unregister('slug')
    router.refresh()
  }, [unregister, router])

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      const user_id = post?.user_id
      if (!user_id) throw new Error('Require is not defined.')

      const values = {
        user_id,
        status: 'trash',
        deleted_at: new Date().toISOString(),
      }

      const result = await trigger(values)
      if (result?.error) throw new Error(result?.error?.message)

      toast.success(t('FormMessage.changed_successfully'))

      router.push('/dashboard/posts')
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        form.setError('slug', { message: t('FormMessage.duplicate_slug') })
      } else {
        toast.error((e as Error)?.message)
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
  const { t } = useTranslation()
  const { form, post } = usePostForm()

  const { trigger } = useSWRMutation(
    post?.id ? `/api/v1/post/${post?.id}` : null,
    sendRequest
  )
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      const user_id = post?.user_id
      if (!user_id) throw new Error('Require is not defined.')

      const formValues = form.getValues()
      const slug = kebabCase(formValues.slug)
      const status = 'publish'
      const published_at = new Date().toISOString()

      const values = post?.published_at
        ? { ...formValues, slug, user_id, status }
        : { ...formValues, slug, user_id, status, published_at }

      const result = await trigger(values)
      if (result?.error) throw new Error(result?.error?.message)

      toast.success(t('FormMessage.changed_successfully'))
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        form.setError('slug', { message: t('FormMessage.duplicate_slug') })
      } else {
        toast.error((e as Error)?.message)
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
      {t('PostMetabox.publish')}
    </Button>
  )
}
