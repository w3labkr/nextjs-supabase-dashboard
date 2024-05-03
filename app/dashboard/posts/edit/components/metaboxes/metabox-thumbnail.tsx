'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

import { UseFormReturn } from 'react-hook-form'
import { FormValues } from '../../post-form'

interface MetaboxThumbnailProps {
  form: UseFormReturn<FormValues>
}

const MetaboxThumbnail = (props: MetaboxThumbnailProps) => {
  const { form } = props
  const { t } = useTranslation()

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('PostMetabox.featured_image')}</AccordionTrigger>
        <AccordionContent>
          <Button variant="secondary" className="h-32 w-full" disabled>
            {t('PostMetabox.set_featured_image')}
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export { MetaboxThumbnail, type MetaboxThumbnailProps }
