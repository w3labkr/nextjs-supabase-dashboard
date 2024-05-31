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
import { Calendar } from '@/components/ui/calendar'
import { TimePicker } from '@/components/time-picker'

import { usePostForm } from '@/app/dashboard/posts/edit/context/post-form-provider'

const MetaboxFutureDate = () => {
  const { t } = useTranslation()
  const { post } = usePostForm()
  const { control, register, setValue } = useFormContext()

  const watchStatus: string = useWatch({ control, name: 'status' })

  const [date, setDate] = React.useState<Date | undefined>(new Date())

  React.useEffect(() => {
    if (watchStatus === 'future') {
      setValue('date', date?.toISOString(), {
        shouldDirty: true,
        shouldValidate: true,
      })
    } else if (post?.date) {
      const now = new Date()
      const posted_on = new Date(post?.date)
      const value = posted_on > now ? now : posted_on
      setValue('date', value?.toISOString(), {
        shouldDirty: true,
        shouldValidate: true,
      })
    }
  }, [watchStatus, setValue, date, post?.date])

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('PostMetabox.future')}</AccordionTrigger>
        <AccordionContent className="space-y-2 px-1 py-1 pb-4">
          <input {...register('date')} type="hidden" />
          <Switch
            checked={watchStatus === 'future'}
            onCheckedChange={(checked: boolean) => {
              setValue('status', checked ? 'future' : 'draft', {
                shouldDirty: true,
                shouldValidate: true,
              })
            }}
          />
          {watchStatus === 'future' ? (
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          ) : null}
          {watchStatus === 'future' ? (
            <TimePicker date={date} setDate={setDate} />
          ) : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export { MetaboxFutureDate }
