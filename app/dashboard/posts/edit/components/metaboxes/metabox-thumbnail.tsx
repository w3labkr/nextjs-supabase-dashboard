'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'

import { toast } from 'sonner'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { createClient } from '@/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { usePostForm } from '../../post-form-provider'

const MetaboxThumbnail = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { register, setValue } = useFormContext()
  const { post } = usePostForm()

  const thumbnail_url: string = post?.thumbnail_url ?? ''
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [watchValue, setWatchValue] = React.useState<string>('')
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  React.useEffect(() => {
    setValue('thumbnail_url', thumbnail_url, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setWatchValue(thumbnail_url)
  }, [setValue, thumbnail_url])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsSubmitting(true)

      e.preventDefault()

      const target = e.currentTarget as HTMLInputElement
      const file = target?.files ? target?.files[0] : null

      if (!file) throw new Error('Require is not defined.')
      if (!user) throw new Error('Require is not defined.')

      const bucketId = process.env.NEXT_PUBLIC_SUPABASE_ID!
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

        setValue('thumbnail_url', publicUrl)
        setWatchValue(publicUrl)
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
          <input
            {...register('thumbnail_url')}
            type="hidden"
            value={watchValue}
            readOnly
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {watchValue ? null : (
            <button
              type="button"
              className="text-blue-500 underline"
              onClick={() => {
                if (fileInputRef.current !== null) {
                  fileInputRef.current.click()
                }
              }}
            >
              {t('PostMetabox.set_featured_image')}
            </button>
          )}
          {watchValue ? (
            <>
              <button
                type="button"
                className="w-full"
                onClick={() => {
                  if (fileInputRef.current !== null) {
                    fileInputRef.current.click()
                  }
                }}
                disabled={isSubmitting}
              >
                <img
                  src={watchValue}
                  alt=""
                  className="h-auto w-full rounded"
                />
              </button>
              <div className="text-muted-foreground">
                {t('PostMetabox.edit_featured_image')}
              </div>
            </>
          ) : null}
          {watchValue ? (
            <button
              type="button"
              className="mt-2 text-destructive"
              onClick={() => {
                setValue('thumbnail_url', '')
                setWatchValue('')
              }}
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
