'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'

import { FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

const MetaboxDescription = () => {
  const { t } = useTranslation()
  const { register, getFieldState, formState } = useFormContext()
  const fieldState = getFieldState('description', formState)

  return (
    <div>
      <div className="py-2">{t('description')}</div>
      <div>
        <Textarea
          placeholder={t('please_enter_your_message')}
          rows={5}
          {...register('description')}
        />
        <FormMessage className="mt-2">{fieldState?.error?.message}</FormMessage>
      </div>
    </div>
  )
}

export { MetaboxDescription }
