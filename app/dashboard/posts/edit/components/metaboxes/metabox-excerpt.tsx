'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

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
  const {
    form: { setValue, getFieldState },
    post,
  } = usePostForm()

  const field = getFieldState('excerpt')
  const [watchValue, setWatchValue] = React.useState<string>('')

  React.useEffect(() => {
    const value = post?.excerpt ?? ''
    setValue('excerpt', value)
    setWatchValue(value)
  }, [setValue, post?.excerpt])

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('PostMetabox.excerpt')}</AccordionTrigger>
        <AccordionContent className="px-1 py-1 pb-4">
          <Textarea
            name="excerpt"
            placeholder={t('Textarea.please_enter_your_message')}
            rows={5}
            value={watchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setValue('excerpt', e.target.value)
              setWatchValue(e.target.value)
            }}
          />
          <FormMessage>{field?.error?.message}</FormMessage>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export { MetaboxExcerpt }
