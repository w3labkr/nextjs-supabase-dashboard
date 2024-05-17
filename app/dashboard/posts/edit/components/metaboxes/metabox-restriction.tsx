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
import { usePostForm } from '../../post-form-provider'

const MetaboxRectriction = () => {
  const { t } = useTranslation()
  const {
    form: { setValue },
    post,
  } = usePostForm()

  const [watchValue, setWatchValue] = React.useState<boolean>(false)

  React.useEffect(() => {
    const value = post?.status ?? ''
    setValue('status', value)
    setWatchValue(value)
  }, [setValue, post?.status])

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('PostMetabox.private')}</AccordionTrigger>
        <AccordionContent className="flex items-center gap-2">
          <Switch
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
