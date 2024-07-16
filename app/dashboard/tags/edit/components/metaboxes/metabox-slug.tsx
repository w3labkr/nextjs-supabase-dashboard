'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useFormContext, useWatch } from 'react-hook-form'
import { debounce } from 'lodash'

import { FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useTagForm } from '@/app/dashboard/tags/edit/context/tag-form-provider'

import { slugify } from '@/lib/slugify'

const MetaboxSlug = () => {
  const { t } = useTranslation()
  const { tag } = useTagForm()
  const { control, register, setValue, getFieldState, formState } =
    useFormContext()

  const fieldState = getFieldState('slug', formState)
  const watchName: string = useWatch({ control, name: 'name' })
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
      if (!tag?.slug) setSlug(watchName)
    }, 0)
    return () => clearTimeout(timer)
  }, [tag?.slug, setSlug, watchName])

  return (
    <div>
      <div className="py-2">{t('slug')}</div>
      <div>
        <Input
          placeholder={t('please_enter_your_text')}
          onChangeCapture={debounce((e: React.FormEvent<HTMLInputElement>) => {
            setSlug((e.target as HTMLInputElement).value)
          }, 1000)}
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
        <FormMessage className="mt-2">{fieldState?.error?.message}</FormMessage>
      </div>
    </div>
  )
}

export { MetaboxSlug }
