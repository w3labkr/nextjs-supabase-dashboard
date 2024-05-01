'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

import { UseFormReturn } from 'react-hook-form'
import { FormValues } from '../../post-form'

export function MetaboxExcerpt({ form }: { form: UseFormReturn<FormValues> }) {
  const { t } = useTranslation()

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('PostMetabox.excerpt')}</AccordionTrigger>
        <AccordionContent className="px-1 py-1 pb-4">
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel></FormLabel> */}
                <FormControl>
                  <Textarea
                    placeholder={t('Textarea.please_enter_your_message')}
                    rows={5}
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
