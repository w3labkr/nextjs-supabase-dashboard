'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { LucideIcon } from '@/lib/lucide-icon'
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

import { usePostForm } from '../post-form-provider'

export function MetaboxExcerpt() {
  const { t } = useTranslation()
  const { form } = usePostForm()

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
