'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { usePostForm } from '../../post-form-provider'

import { createClient } from '@/supabase/client'
import { useAuth } from '@/hooks/use-auth'

const MetaboxThumbnail = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { form, post } = usePostForm()
  const { setValue } = form

  const fileInputRef = React.useRef(null)
  const [watchValue, setWatchValue] = React.useState<string>('')
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  React.useEffect(() => {
    const value = post?.thumbnail_url ?? ''
    setValue('thumbnail_url', value)
    setWatchValue(value)
  }, [setValue, post?.thumbnail_url])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsSubmitting(true)

      e.preventDefault()

      const target = e.currentTarget as HTMLInputElement
      const file = target.files[0]

      if (!file) throw new Error('Require is not defined.')
      if (!user) throw new Error('Require is not defined.')

      const bucketId = process.env.NEXT_PUBLIC_SUPABASE_ID!
      const filePath = `${user?.id}/${file.name}`

      const supabase = createClient()
      const result = await supabase.storage
        .from(bucketId)
        .upload(filePath, file, { upsert: true })

      if (result?.data?.path) {
        const {
          data: { publicUrl },
        } = await supabase.storage
          .from(bucketId)
          .getPublicUrl(result?.data?.path)

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
            type="hidden"
            name="thumbnail_url"
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
              onClick={() => fileInputRef.current.click()}
            >
              {t('PostMetabox.set_featured_image')}
            </button>
          )}
          {watchValue ? (
            <>
              <button
                type="button"
                className="w-full"
                onClick={() => fileInputRef.current.click()}
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
