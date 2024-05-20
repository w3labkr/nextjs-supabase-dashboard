'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

import { usePostForm } from '../../post-form-provider'

const MetaboxExcerpt = () => {
  const { t } = useTranslation()
  const { register, setValue, getFieldState } = useFormContext()
  const { post } = usePostForm()

  const field = getFieldState('excerpt')
  const excerpt: string = post?.excerpt ?? ''
  const [watchValue, setWatchValue] = React.useState<string>('')

  React.useEffect(() => {
    setValue('excerpt', excerpt, { shouldDirty: true, shouldValidate: true })
    setWatchValue(excerpt)
  }, [setValue, excerpt])

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('PostMetabox.excerpt')}</AccordionTrigger>
        <AccordionContent className="px-1 py-1 pb-4">
          <Textarea
            {...register('excerpt')}
            placeholder={t('Textarea.please_enter_your_message')}
            value={watchValue}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setValue('excerpt', e.target.value)
              setWatchValue(e.target.value)
            }}
            rows={5}
          />
          <FormMessage className="mt-2">{field?.error?.message}</FormMessage>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export { MetaboxExcerpt }
