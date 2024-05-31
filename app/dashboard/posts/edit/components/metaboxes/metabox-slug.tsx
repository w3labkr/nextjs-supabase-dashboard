'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useFormContext, useWatch } from 'react-hook-form'
import { debounce } from 'lodash'
import slugify from 'slugify'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { usePostForm } from '@/app/dashboard/posts/edit/context/post-form-provider'

const MetaboxSlug = () => {
  const { t } = useTranslation()
  const { post } = usePostForm()
  const { control, register, setValue, getFieldState, formState } =
    useFormContext()

  const fieldState = getFieldState('slug', formState)
  const watchTitle: string = useWatch({ control, name: 'title' })
  const setSlug = React.useCallback(
    (value: string) => {
      const slugified = slugify(value, {
        replacement: '-', // replace spaces with replacement character, defaults to `-`
        remove: /[^\p{L}\d\s]+/gu, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: false, // strip special characters except replacement, defaults to `false`
        trim: true, // trim leading and trailing replacement chars, defaults to `true`
      })
      setValue('slug', slugified, { shouldDirty: true, shouldValidate: true })
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
        <AccordionTrigger>{t('PostMetabox.slug')}</AccordionTrigger>
        <AccordionContent className="px-1 py-1 pb-4">
          <Input
            {...register('slug')}
            type="text"
            placeholder={t('Input.please_enter_your_text')}
            onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
              setSlug(e.currentTarget.value)
            }, 1000)}
            onBlur={(e: React.FocusEvent<HTMLInputElement, Element>) => {
              setSlug(e.currentTarget.value)
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') setSlug(e.currentTarget.value)
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
