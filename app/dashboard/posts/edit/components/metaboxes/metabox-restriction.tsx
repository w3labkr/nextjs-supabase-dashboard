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
import { Switch } from '@/components/ui/switch'

import { usePostForm } from '../../post-form-provider'

const MetaboxRectriction = () => {
  const { t } = useTranslation()
  const { register, setValue } = useFormContext()
  const { post } = usePostForm()

  const status: string = post?.status ?? ''
  const [watchValue, setWatchValue] = React.useState<string>('')

  React.useEffect(() => {
    setValue('status', status, { shouldDirty: true, shouldValidate: true })
    setWatchValue(status)
  }, [setValue, status])

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('PostMetabox.private')}</AccordionTrigger>
        <AccordionContent className="flex items-center gap-2">
          <Switch
            {...register('status')}
            checked={watchValue === 'private'}
            onCheckedChange={(checked: boolean) => {
              const value = checked ? 'private' : 'public'
              setValue('status', value)
              setWatchValue(value)
            }}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export { MetaboxRectriction }
