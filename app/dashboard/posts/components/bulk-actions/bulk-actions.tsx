'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { usePaging } from '@/components/paging'
import { useBulkActions } from './bulk-actions-provider'

import { useSWRConfig } from 'swr'
import {
  cn,
  fetcher,
  setQueryString,
  getPostPath,
  getAuthorPath,
  getAuthorFavoritesPath,
  setMeta,
  getMeta,
} from '@/lib/utils'
import { PostAPI } from '@/types/api'
import { Post } from '@/types/database'

const FormSchema = z.object({
  action: z.string(),
})

type FormValues = z.infer<typeof FormSchema>

interface BulkActionsProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const BulkActions = ({ className, ...props }: BulkActionsProps) => {
  const { t } = useTranslation()
  const { checks } = useBulkActions()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: {
      action: 'unassigned',
    },
  })
  const { control, handleSubmit, setValue } = form

  const paging = usePaging()
  const { mutate } = useSWRConfig()
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const getData = React.useCallback((action: string, post: Post) => {
    const user_id = post?.user_id
    const visibility = getMeta(post?.meta, 'visibility')
    const future_date = getMeta(post?.meta, 'future_date')
    const now = new Date().toISOString()

    if (action === 'draft') {
      return { status: 'draft', user_id }
    } else if (action === 'publish') {
      const data = {
        status: visibility === 'private' ? 'private' : 'publish',
        meta: setMeta(post?.meta, 'future_date', null, {
          post_id: post?.id,
        }),
        user_id,
      }
      return post?.date ? data : { ...data, date: now }
    } else if (action === 'public') {
      const data = {
        status: future_date ? 'future' : 'publish',
        meta: setMeta(post?.meta, 'visibility', 'public', {
          post_id: post?.id,
        }),
        user_id,
      }
      return post?.date ? data : { ...data, date: now }
    } else if (action === 'private') {
      const data = {
        status: future_date ? 'future' : 'private',
        meta: setMeta(post?.meta, 'visibility', 'private', {
          post_id: post?.id,
        }),
        user_id,
      }
      return post?.date ? data : { ...data, date: now }
    } else if (action === 'trash') {
      return { status: 'trash', deleted_at: now, user_id }
    } else if (action === 'restore') {
      return { status: 'draft', deleted_at: null, user_id }
    } else if (action === 'delete') {
      return { user_id }
    }

    return null
  }, [])

  const onSubmit = async (formValues: FormValues) => {
    if (formValues?.action === 'unassigned') return false
    if (checks.length < 1) return false

    try {
      setIsSubmitting(true)

      for (let i = 0; i < checks.length; i++) {
        const post = checks[i]

        const data = getData(formValues?.action, post)
        const revalidatePaths = [
          getPostPath(post),
          getAuthorPath(post),
          getAuthorFavoritesPath(post),
        ]

        if (!data) throw new Error('Require is not defined.')

        const method = formValues?.action === 'delete' ? 'DELETE' : 'POST'
        const result = await fetcher<PostAPI>(`/api/v1/post?id=${post?.id}`, {
          method,
          body: JSON.stringify({ data, options: { revalidatePaths } }),
        })

        if (result?.error) throw new Error(result?.error?.message)

        const countSearchParams = setQueryString({
          userId: post?.user_id,
          postType: paging?.postType,
          q: paging?.q,
        })

        const listSearchParams = setQueryString({
          userId: post?.user_id,
          page: paging?.page,
          perPage: paging?.perPage,
          postType: paging?.postType,
          status: paging?.status,
          q: paging?.q,
        })

        mutate(`/api/v1/post?id=${post?.id}`)
        mutate(`/api/v1/post/count?${countSearchParams}`)
        mutate(`/api/v1/post/list?${listSearchParams}`)
      }

      toast.success(t('FormMessage.changed_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  React.useEffect(() => {
    setValue('action', 'unassigned')
  }, [paging, setValue])

  return (
    <Form {...form}>
      <form
        method="POST"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className={cn('flex items-start space-x-2', className)}
        {...props}
      >
        <FormField
          control={control}
          name="action"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel></FormLabel> */}
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('BulkActions.placeholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="unassigned">
                    {t('BulkActions.placeholder')}
                  </SelectItem>
                  {[null, 'publish', 'future', 'private'].includes(
                    paging?.status
                  ) ? (
                    <DraftItem />
                  ) : null}
                  {[null, 'draft', 'future'].includes(paging?.status) ? (
                    <PublishItem />
                  ) : null}
                  {[null, 'private'].includes(paging?.status) ? (
                    <PublicItem />
                  ) : null}
                  {[null, 'publish'].includes(paging?.status) ? (
                    <PrivateItem />
                  ) : null}
                  {!['trash'].includes(paging?.status) ? <TrashItem /> : null}
                  {['trash'].includes(paging?.status) ? <RestoreItem /> : null}
                  {['trash'].includes(paging?.status) ? <DeleteItem /> : null}
                </SelectContent>
              </Select>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {t('BulkActions.submit')}
        </Button>
      </form>
    </Form>
  )
}

const DraftItem = () => {
  const { t } = useTranslation()

  return <SelectItem value="draft">{t('BulkActions.draft')}</SelectItem>
}

const PublishItem = () => {
  const { t } = useTranslation()

  return <SelectItem value="publish">{t('BulkActions.publish')}</SelectItem>
}

const PublicItem = () => {
  const { t } = useTranslation()

  return <SelectItem value="public">{t('BulkActions.public')}</SelectItem>
}

const PrivateItem = () => {
  const { t } = useTranslation()

  return <SelectItem value="private">{t('BulkActions.private')}</SelectItem>
}

const TrashItem = () => {
  const { t } = useTranslation()

  return <SelectItem value="trash">{t('BulkActions.trash')}</SelectItem>
}

const RestoreItem = () => {
  const { t } = useTranslation()

  return <SelectItem value="restore">{t('BulkActions.restore')}</SelectItem>
}

const DeleteItem = () => {
  const { t } = useTranslation()

  return <SelectItem value="delete">{t('BulkActions.delete')}</SelectItem>
}

export { BulkActions, type BulkActionsProps }
