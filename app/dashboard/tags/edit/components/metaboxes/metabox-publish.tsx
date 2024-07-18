'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'

import { toast } from 'sonner'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { useTagForm } from '@/app/dashboard/tags/edit/context/tag-form-provider'

import { useSWRConfig } from 'swr'
import { fetcher } from '@/lib/utils'
import { TagAPI } from '@/types/api'

const MetaboxPublish = () => {
  const { t } = useTranslation()

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger className="lg:pt-0">{t('publish')}</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="flex justify-between">
            <DeleteButton />
            <PublishButton />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

const DeleteButton = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { tag } = useTagForm()
  const { handleSubmit, getValues } = useFormContext()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!tag) throw new Error('Require is not defined.')

      const formValues = getValues()
      const post_tags = formValues?.post_tags

      const { error } = await fetcher<TagAPI>(`/api/v1/tag?id=${tag?.id}`, {
        method: 'DELETE',
        body: JSON.stringify({ data: formValues }),
      })

      if (error) throw new Error(error?.message)

      mutate(`/api/v1/tag?id=${tag?.id}`)

      if (Array.isArray(post_tags) && post_tags?.length > 0) {
        for (let i = 0; i < post_tags.length; i++) {
          const post_tag = post_tags[i]
          mutate(`/api/v1/post?id=${post_tag?.post_id}`)
        }
      }

      toast.success(t('deleted_successfully'))

      router.push('/dashboard/tags')
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="border-destructive text-destructive dark:border-white dark:text-white"
      onClick={handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {t('delete')}
    </Button>
  )
}

const PublishButton = () => {
  const { t } = useTranslation()
  const { tag } = useTagForm()
  const { getValues, handleSubmit } = useFormContext()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!tag) throw new Error('Require is not defined.')

      const formValues = getValues()
      const post_tags = formValues?.post_tags

      const { error } = await fetcher<TagAPI>(`/api/v1/tag?id=${tag?.id}`, {
        method: 'POST',
        body: JSON.stringify({ data: formValues }),
      })

      if (error) throw new Error(error?.message)

      mutate(`/api/v1/tag?id=${tag?.id}`)

      if (Array.isArray(post_tags) && post_tags?.length > 0) {
        for (let i = 0; i < post_tags.length; i++) {
          const post_tag = post_tags[i]
          mutate(`/api/v1/post?id=${post_tag?.post_id}`)
        }
      }

      toast.success(t('changed_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
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
      {t('update')}
    </Button>
  )
}

export { MetaboxPublish }
