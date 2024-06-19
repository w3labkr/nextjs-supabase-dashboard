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
import { usePostForm } from '@/app/dashboard/posts/edit/context/post-form-provider'

import { Meta } from '@/types/database'
import { getMeta, setMeta } from '@/lib/utils'

const MetaboxRectriction = () => {
  const { t } = useTranslation()
  const { post } = usePostForm()
  const { control, setValue } = useFormContext()
  const watchMeta: Meta | undefined = useWatch({ control, name: 'meta' })

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
    return getMeta(watchMeta, 'visibility') === 'private'
  }, [watchMeta])

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('private')}</AccordionTrigger>
        <AccordionContent className="flex items-center gap-2">
          <Switch
            checked={checked}
            onCheckedChange={(value: boolean) => {
              const metaValue = value ? 'private' : 'public'
              setMetaValue(watchMeta, 'visibility', metaValue)
            }}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export { MetaboxRectriction }
