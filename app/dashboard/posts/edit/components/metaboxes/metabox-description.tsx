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

const MetaboxDescription = () => {
  const { t } = useTranslation()
  const { register, getFieldState, formState } = useFormContext()
  const fieldState = getFieldState('description', formState)

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('description')}</AccordionTrigger>
        <AccordionContent className="px-1 py-1 pb-4">
          <Textarea
            placeholder={t('please_enter_your_message')}
            rows={5}
            {...register('description')}
          />
          <FormMessage className="mt-2">
            {fieldState?.error?.message}
          </FormMessage>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export { MetaboxDescription }
