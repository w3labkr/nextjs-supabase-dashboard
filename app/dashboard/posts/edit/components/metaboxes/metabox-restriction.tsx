'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useFormContext, useWatch } from 'react-hook-form'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Switch } from '@/components/ui/switch'

const MetaboxRectriction = () => {
  const { t } = useTranslation()
  const { control, register, setValue } = useFormContext()
  const watchStatus: string = useWatch({ control, name: 'status' })

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('PostMetabox.private')}</AccordionTrigger>
        <AccordionContent className="flex items-center gap-2">
          <input {...register('status')} type="hidden" />
          <Switch
            checked={watchStatus === 'private'}
            onCheckedChange={(checked: boolean) => {
              setValue('status', checked ? 'private' : 'public', {
                shouldDirty: true,
                shouldValidate: true,
              })
            }}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export { MetaboxRectriction }
