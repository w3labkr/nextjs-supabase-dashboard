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
  setMeta,
  getMetaValue,
  relativeUrl,
} from '@/lib/utils'
import { slugify } from '@/lib/slugify'
import { type PostAPI } from '@/types/api'
import { type Post } from '@/types/database'

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

  const onSubmit = async (formValues: FormValues) => {
    if (formValues?.action === 'unassigned') return false
    if (checks.length < 1) return false

    try {
      setIsSubmitting(true)

      for (let i = 0; i < checks.length; i++) {
        const check = checks[i]

        const user_id = check?.user_id
        const visibility = getMetaValue(check?.meta, 'visibility')
        const future_date = getMetaValue(check?.meta, 'future_date')
        const now = new Date().toISOString()

        const revalidatePaths = check?.permalink
          ? relativeUrl(check?.permalink)
          : null

        if (formValues?.action === 'draft') {
          const { error } = await fetcher<PostAPI>(
            `/api/v1/post?id=${check?.id}`,
            {
              method: 'POST',
              body: JSON.stringify({
                data: { status: 'draft', user_id },
                options: { revalidatePaths },
              }),
            }
          )
          if (error) throw new Error(error?.message)
        } else if (formValues?.action === 'publish') {
          const data = {
            status: visibility === 'private' ? 'private' : 'publish',
            slug: check?.slug ?? slugify(check?.title ?? ''),
            meta: setMeta(check?.meta, 'future_date', null, {
              post_id: check?.id,
            }),
            user_id,
          }
          const { error } = await fetcher<PostAPI>(
            `/api/v1/post?id=${check?.id}`,
            {
              method: 'POST',
              body: JSON.stringify({
                data: check?.date ? data : { ...data, date: now },
                options: { revalidatePaths },
              }),
            }
          )
          if (error) throw new Error(error?.message)
        } else if (formValues?.action === 'public') {
          const data = {
            status: future_date ? 'future' : 'publish',
            meta: setMeta(check?.meta, 'visibility', 'public', {
              post_id: check?.id,
            }),
            user_id,
          }
          const { error } = await fetcher<PostAPI>(
            `/api/v1/post?id=${check?.id}`,
            {
              method: 'POST',
              body: JSON.stringify({
                data: check?.date ? data : { ...data, date: now },
                options: { revalidatePaths },
              }),
            }
          )
          if (error) throw new Error(error?.message)
        } else if (formValues?.action === 'private') {
          const data = {
            status: future_date ? 'future' : 'private',
            meta: setMeta(check?.meta, 'visibility', 'private', {
              post_id: check?.id,
            }),
            user_id,
          }
          const { error } = await fetcher<PostAPI>(
            `/api/v1/post?id=${check?.id}`,
            {
              method: 'POST',
              body: JSON.stringify({
                data: check?.date ? data : { ...data, date: now },
                options: { revalidatePaths },
              }),
            }
          )
          if (error) throw new Error(error?.message)
        } else if (formValues?.action === 'trash') {
          const { error } = await fetcher<PostAPI>(
            `/api/v1/post?id=${check?.id}`,
            {
              method: 'POST',
              body: JSON.stringify({
                data: { status: 'trash', deleted_at: now, user_id },
                options: { revalidatePaths },
              }),
            }
          )
          if (error) throw new Error(error?.message)
        } else if (formValues?.action === 'restore') {
          const { error } = await fetcher<PostAPI>(
            `/api/v1/post?id=${check?.id}`,
            {
              method: 'POST',
              body: JSON.stringify({
                data: { status: 'draft', deleted_at: null, user_id },
                options: { revalidatePaths },
              }),
            }
          )
          if (error) throw new Error(error?.message)
        } else if (formValues?.action === 'delete') {
          const { error } = await fetcher<PostAPI>(
            `/api/v1/post?id=${check?.id}`,
            {
              method: 'DELETE',
              body: JSON.stringify({
                data: { user_id },
                options: { revalidatePaths },
              }),
            }
          )
          if (error) throw new Error(error?.message)
        }

        const countSearchParams = setQueryString({
          userId: check?.user_id,
          postType: paging?.postType,
          q: paging?.q,
        })

        const listSearchParams = setQueryString({
          userId: check?.user_id,
          postType: paging?.postType,
          status: paging?.status,
          q: paging?.q,
          orderBy: paging?.orderBy,
          order: paging?.order,
          perPage: paging?.perPage,
          page: paging?.page,
        })

        mutate(`/api/v1/post?id=${check?.id}`)
        mutate(`/api/v1/post/count?${countSearchParams}`)
        mutate(`/api/v1/post/list?${listSearchParams}`)
      }

      toast.success(t('changed_successfully'))
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
        className={cn('flex items-start gap-2', className)}
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
                    <SelectValue placeholder={t('bulk_actions')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="unassigned">
                    {t('bulk_actions')}
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
          {t('apply')}
        </Button>
      </form>
    </Form>
  )
}

const DraftItem = () => {
  const { t } = useTranslation()

  return <SelectItem value="draft">{t('draft')}</SelectItem>
}

const PublishItem = () => {
  const { t } = useTranslation()

  return <SelectItem value="publish">{t('publish')}</SelectItem>
}

const PublicItem = () => {
  const { t } = useTranslation()

  return <SelectItem value="public">{t('public')}</SelectItem>
}

const PrivateItem = () => {
  const { t } = useTranslation()

  return <SelectItem value="private">{t('private')}</SelectItem>
}

const TrashItem = () => {
  const { t } = useTranslation()

  return <SelectItem value="trash">{t('trash')}</SelectItem>
}

const RestoreItem = () => {
  const { t } = useTranslation()

  return <SelectItem value="restore">{t('restore')}</SelectItem>
}

const DeleteItem = () => {
  const { t } = useTranslation()

  return <SelectItem value="delete">{t('delete')}</SelectItem>
}

export { BulkActions, type BulkActionsProps }
