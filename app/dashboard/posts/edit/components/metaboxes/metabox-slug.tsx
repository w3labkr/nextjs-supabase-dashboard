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
  const { post } = usePostForm()
  const { control, register, setValue, getFieldState, formState } =
    useFormContext()

  const fieldState = getFieldState('slug', formState)
  const watchTitle: string = useWatch({ control, name: 'title' })

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!post?.slug) {
        setValue('slug', kebabCase(watchTitle), {
          shouldDirty: true,
          shouldValidate: true,
        })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [post?.slug, setValue, watchTitle])

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('PostMetabox.slug')}</AccordionTrigger>
        <AccordionContent className="px-1 py-1 pb-4">
          <Input
            {...register('slug')}
            type="text"
            placeholder={t('Input.please_enter_your_text')}
            onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
              setValue('slug', kebabCase(e.target.value), {
                shouldDirty: true,
                shouldValidate: true,
              })
            }, 1000)}
            onBlur={(e: React.FocusEvent<HTMLInputElement, Element>) => {
              setValue('slug', kebabCase(e.target.value), {
                shouldDirty: true,
                shouldValidate: true,
              })
            }}
          />
          <FormMessage className="mt-2">
            {fieldState?.error?.message}
          </FormMessage>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export { MetaboxSlug }
