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
import { cn, fetcher, setQueryString } from '@/lib/utils'
import { type PostAPI } from '@/types/api'
import { type Tag } from '@/types/database'

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

  const getData = React.useCallback((action: string, tag: Tag) => {
    if (action === 'delete') {
      return {
        user_id: tag?.user_id,
        name: tag?.name,
        slug: tag?.slug,
        post_tags: tag?.post_tags,
      }
    }

    return null
  }, [])

  const onSubmit = async (formValues: FormValues) => {
    if (formValues?.action === 'unassigned') return false
    if (checks.length < 1) return false

    try {
      setIsSubmitting(true)

      for (let i = 0; i < checks.length; i++) {
        const tag = checks[i]
        const data = getData(formValues?.action, tag)

        if (!data) throw new Error('Require is not defined.')

        const { error } = await fetcher<PostAPI>(`/api/v1/tag?id=${tag?.id}`, {
          method: formValues?.action === 'delete' ? 'DELETE' : 'POST',
          body: JSON.stringify({ data }),
        })

        if (error) throw new Error(error?.message)

        const listSearchParams = setQueryString({
          userId: tag?.user_id,
          q: paging?.q,
          orderBy: paging?.orderBy,
          order: paging?.order,
          perPage: paging?.perPage,
          page: paging?.page,
        })

        mutate(`/api/v1/tag?id=${tag?.id}`)
        mutate(`/api/v1/tag/list?${listSearchParams}`)

        const post_tags = tag?.post_tags

        if (Array.isArray(post_tags) && post_tags?.length > 0) {
          for (let i = 0; i < post_tags.length; i++) {
            const post_tag = post_tags[i]
            mutate(`/api/v1/post?id=${post_tag?.post_id}`)
          }
        }
      } // end of item

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
                  <DeleteItem />
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

const DeleteItem = () => {
  const { t } = useTranslation()

  return <SelectItem value="delete">{t('delete')}</SelectItem>
}

export { BulkActions, type BulkActionsProps }
