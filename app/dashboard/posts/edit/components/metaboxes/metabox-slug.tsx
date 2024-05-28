'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useFormContext, useWatch } from 'react-hook-form'
import { kebabCase, debounce } from 'lodash'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { usePostForm } from '../../post-form-provider'

const MetaboxSlug = () => {
  const { t } = useTranslation()
  const { control, register, setValue, getFieldState } = useFormContext()
  const { post } = usePostForm()

  const field = getFieldState('slug')
  const watchTitle: string = useWatch({ control, name: 'title' })
  const watchSlug: string = useWatch({ control, name: 'slug' })

  const debounceSetValue = React.useCallback(
    debounce((value: string) => {
      const slugified = kebabCase(value)
      setValue('slug', slugified, { shouldDirty: true, shouldValidate: true })
    }, 300),
    []
  )

  React.useEffect(() => {
    if (post?.slug) {
      debounceSetValue(post?.slug)
    } else {
      debounceSetValue(watchTitle)
    }
  }, [debounceSetValue, post?.slug, watchTitle])

  React.useEffect(() => {
    debounceSetValue(watchSlug)
  }, [debounceSetValue, watchSlug])

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('PostMetabox.slug')}</AccordionTrigger>
        <AccordionContent className="px-1 py-1 pb-4">
          <Input
            {...register('slug')}
            type="text"
            placeholder={t('Input.please_enter_your_text')}
          />
          <FormMessage className="mt-2">{field?.error?.message}</FormMessage>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export { MetaboxSlug }
