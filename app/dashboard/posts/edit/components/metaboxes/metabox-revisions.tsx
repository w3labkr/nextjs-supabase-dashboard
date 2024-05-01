'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { UseFormReturn } from 'react-hook-form'
import { FormValues } from '../../post-form'

export function MetaboxRevisions({
  form,
}: {
  form: UseFormReturn<FormValues>
}) {
  const { t } = useTranslation()

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('PostMetabox.revisions')}</AccordionTrigger>
        <AccordionContent className="px-1 py-1 pb-4">
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
