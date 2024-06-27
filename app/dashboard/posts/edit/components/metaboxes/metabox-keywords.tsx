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

const MetaboxKeywords = () => {
  const { t } = useTranslation()
  const { register, getFieldState, formState } = useFormContext()
  const fieldState = getFieldState('keywords', formState)

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('keywords')}</AccordionTrigger>
        <AccordionContent className="px-1 py-1 pb-4">
          <Textarea
            {...register('keywords')}
            placeholder={t('please_enter_your_message')}
            rows={3}
          />
          <FormMessage className="mt-2">
            {fieldState?.error?.message}
          </FormMessage>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export { MetaboxKeywords }
