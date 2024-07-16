'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
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
import { useTagForm } from '@/app/dashboard/tags/edit/context/tag-form-provider'

import { useSWRConfig } from 'swr'
import { fetcher, getMeta, relativeUrl } from '@/lib/utils'
import { PostAPI } from '@/types/api'

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
  const { getValues, handleSubmit, unregister } = useFormContext()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  React.useEffect(() => {
    unregister('slug')
    router.refresh()
  }, [unregister, router])

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!tag) throw new Error('Require is not defined.')

      const formValues = getValues()
      const revalidatePaths = tag?.permalink
        ? relativeUrl(tag?.permalink)
        : null

      const { error } = await fetcher<PostAPI>(`/api/v1/tag?id=${tag?.id}`, {
        method: 'DELETE',
        body: JSON.stringify({
          data: { ...formValues, status: 'trash' },
          options: { revalidatePaths },
        }),
      })

      if (error) throw new Error(error?.message)

      toast.success(t('changed_successfully'))

      router.push('/dashboard/posts')
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
      const revalidatePaths = tag?.slug
        ? relativeUrl(`/posts?tag=${tag?.slug}`)
        : null

      const { error } = await fetcher<PostAPI>(`/api/v1/tag?id=${tag?.id}`, {
        method: 'POST',
        body: JSON.stringify({
          data: formValues,
          options: { revalidatePaths },
        }),
      })

      if (error) throw new Error(error?.message)

      mutate(`/api/v1/tag?id=${tag?.id}`)

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
