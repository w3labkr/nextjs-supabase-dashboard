'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useFormContext, useWatch } from 'react-hook-form'
import { debounce } from 'lodash'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { usePostForm } from '@/app/dashboard/posts/edit/context/post-form-provider'

import { slugify } from '@/lib/slugify'

const MetaboxSlug = () => {
  const { t } = useTranslation()
  const { post } = usePostForm()
  const { control, register, setValue, getFieldState, formState } =
    useFormContext()

  const fieldState = getFieldState('slug', formState)
  const watchTitle: string = useWatch({ control, name: 'title' })
  const setSlug = React.useCallback(
    (value: string) => {
      setValue('slug', slugify(value ?? ''), {
        shouldDirty: true,
        shouldValidate: true,
      })
    },
    [setValue]
  )

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!post?.slug) setSlug(watchTitle)
    }, 0)
    return () => clearTimeout(timer)
  }, [post?.slug, setSlug, watchTitle])

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('slug')}</AccordionTrigger>
        <AccordionContent className="px-1 py-1 pb-4">
          <Input
            placeholder={t('please_enter_your_text')}
            onChangeCapture={debounce(
              (e: React.FormEvent<HTMLInputElement>) => {
                setSlug((e.target as HTMLInputElement).value)
              },
              1000
            )}
            onBlurCapture={(e: React.FocusEvent<HTMLInputElement, Element>) => {
              setSlug((e.target as HTMLInputElement).value)
            }}
            onKeyDownCapture={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                setSlug((e.target as HTMLInputElement).value)
              }
            }}
            {...register('slug')}
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
