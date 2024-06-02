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

import { Meta } from '@/types/database'
import { getMeta, setMeta } from '@/lib/utils'
import { usePostForm } from '@/app/dashboard/posts/edit/context/post-form-provider'

const MetaboxFutureDate = () => {
  const { t } = useTranslation()
  const { post } = usePostForm()
  const { control, setValue } = useFormContext()

  const watchMeta: Meta | undefined = useWatch({ control, name: 'meta' })
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const setMetaValue = React.useCallback(
    (meta: Meta | undefined, key: string, value: string | null) => {
      const metaValue = setMeta(meta, key, value, {
        post_id: post?.id,
      })
      setValue('meta', metaValue, { shouldDirty: true, shouldValidate: true })
    },
    [post?.id, setValue]
  )

  const checked: boolean = React.useMemo(() => {
    return !!getMeta(watchMeta, 'future_date', null)
  }, [watchMeta])

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('PostMetabox.future')}</AccordionTrigger>
        <AccordionContent className="space-y-2 px-1 py-1 pb-4">
          <Switch
            checked={checked}
            onCheckedChange={(value: boolean) => {
              const metaValue = value ? date?.toISOString() ?? null : null
              setMetaValue(watchMeta, 'future_date', metaValue)
            }}
          />
          {checked ? (
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          ) : null}
          {checked ? <TimePicker date={date} setDate={setDate} /> : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export { MetaboxFutureDate }
