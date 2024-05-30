'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useFormContext, useWatch } from 'react-hook-form'

import { toast } from 'sonner'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { createClient } from '@/supabase/client'
import { useAuth } from '@/hooks/use-auth'

const MetaboxThumbnail = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { control, register, setValue } = useFormContext()

  const watchThumbnailUrl: string = useWatch({ control, name: 'thumbnail_url' })
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleFileInputRef = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current !== null) ref.current.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsSubmitting(true)

      e.preventDefault()

      const file = e.currentTarget?.files ? e.currentTarget?.files[0] : null

      if (!file) throw new Error('Require is not defined.')
      if (!user) throw new Error('Require is not defined.')

      const bucketId = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!
      const filePath = `${user?.id}/${file?.name}`

      const supabase = createClient()
      const uploaded = await supabase.storage
        .from(bucketId)
        .upload(filePath, file, { upsert: true })

      if (uploaded?.data?.path) {
        const {
          data: { publicUrl },
        } = await supabase.storage
          .from(bucketId)
          .getPublicUrl(uploaded?.data?.path)

        setValue('thumbnail_url', publicUrl, {
          shouldDirty: true,
          shouldValidate: true,
        })
      }
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('PostMetabox.featured_image')}</AccordionTrigger>
        <AccordionContent>
          <input {...register('thumbnail_url')} type="hidden" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {watchThumbnailUrl ? null : (
            <button
              type="button"
              className="text-blue-500 underline"
              onClick={() => handleFileInputRef(fileInputRef)}
            >
              {t('PostMetabox.set_featured_image')}
            </button>
          )}
          {watchThumbnailUrl ? (
            <>
              <button
                type="button"
                className="w-full"
                onClick={() => handleFileInputRef(fileInputRef)}
                disabled={isSubmitting}
              >
                <img
                  src={watchThumbnailUrl}
                  alt=""
                  className="h-auto w-full rounded"
                />
              </button>
              <div className="text-muted-foreground">
                {t('PostMetabox.edit_featured_image')}
              </div>
            </>
          ) : null}
          {watchThumbnailUrl ? (
            <button
              type="button"
              className="mt-2 text-destructive"
              onClick={() =>
                setValue('thumbnail_url', '', {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              {t('PostMetabox.remove_featured_image')}
            </button>
          ) : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export { MetaboxThumbnail }
