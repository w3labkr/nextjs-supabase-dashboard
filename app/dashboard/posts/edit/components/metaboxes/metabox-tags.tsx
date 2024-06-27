'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useFormContext, useWatch } from 'react-hook-form'
import { Tag, TagInput } from 'emblor'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { usePostForm } from '@/app/dashboard/posts/edit/context/post-form-provider'

import { Meta } from '@/types/database'
import { getMeta, setMeta } from '@/lib/utils'

const MetaboxTags = () => {
  const { t } = useTranslation()
  const { post } = usePostForm()
  const { control, setValue } = useFormContext()

  const watchMeta: Meta[] | undefined = useWatch({ control, name: 'meta' })
  const watchTags: Tag[] = JSON.parse(getMeta(watchMeta, 'tags', '[]'))

  const [, setTags] = React.useState<Tag[]>([])
  const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(
    null
  )

  const setMetaValue = React.useCallback(
    (meta: Meta[] | undefined, key: string, value: string | null) => {
      const metaValue = setMeta(meta, key, value, {
        post_id: post?.id,
      })
      setValue('meta', metaValue, { shouldDirty: true, shouldValidate: true })
    },
    [post?.id, setValue]
  )

  const handleSetTags = (newTags: React.SetStateAction<Tag[]>) => {
    const metaTags: Tag[] =
      Array.isArray(newTags) && newTags?.length > 0 ? newTags : []
    setTags(metaTags)
    setMetaValue(watchMeta, 'tags', JSON.stringify(metaTags))
  }

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('tags')}</AccordionTrigger>
        <AccordionContent className="px-1 py-1 pb-4">
          <TagInput
            className="flex flex-wrap"
            placeholder={t('add_a_tag')}
            size="sm"
            tags={watchTags}
            setTags={handleSetTags}
            activeTagIndex={activeTagIndex}
            setActiveTagIndex={setActiveTagIndex}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export { MetaboxTags }
