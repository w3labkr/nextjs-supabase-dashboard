'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Switch } from '@/components/ui/switch'

import { Post } from '@/types/database'
import { UseFormReturn } from 'react-hook-form'
import { FormValues } from '../../post-form'

interface MetaboxProps {
  form: UseFormReturn<FormValues>
  post: Post | null
}

const MetaboxRectriction = (props: MetaboxProps) => {
  const { form } = props
  const { t } = useTranslation()

  const status = form.watch('status')

  const handleCheckedChange = (checked: boolean) => {
    if (checked) {
      form.setValue('status', 'private')
    } else {
      form.setValue('status', 'publish')
    }
  }

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('PostMetabox.private')}</AccordionTrigger>
        <AccordionContent className="flex items-center gap-2">
          <Switch
            checked={status === 'private'}
            onCheckedChange={handleCheckedChange}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export { MetaboxRectriction }
