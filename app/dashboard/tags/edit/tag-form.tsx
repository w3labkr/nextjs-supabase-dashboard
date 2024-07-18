'use client'

import * as React from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Form } from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import {
  FieldMeta,
  FieldName,
  FieldUserId,
  FieldPostTags,
} from './components/fields'
import {
  MetaboxSlug,
  MetaboxDescription,
  MetaboxPublish,
} from './components/metaboxes'
import { TagFormProvider } from './context/tag-form-provider'

import { useTagAPI } from '@/queries/client/tags'

const FormSchema = z.object({
  user_id: z.string().nonempty().uuid(),
  name: z.string().nonempty(),
  slug: z.string().nonempty(),
  description: z.string().optional(),
  meta: z.array(z.record(z.string(), z.any())).optional(),
  post_tags: z.array(z.record(z.string(), z.any())).optional(),
})

type FormValues = z.infer<typeof FormSchema>

const TagForm = ({ id }: { id: number }) => {
  const { tag, isLoading } = useTagAPI(id)

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: {
      user_id: tag?.user_id ?? '',
      name: tag?.name ?? '',
      slug: tag?.slug ?? '',
      description: tag?.description ?? '',
      meta: tag?.meta ?? [],
      post_tags: tag?.post_tags ?? [],
    },
    shouldUnregister: true,
  })

  if (isLoading) {
    return (
      <div className="relative grid gap-10 lg:grid-cols-[1fr_280px]">
        <div className="mx-auto w-full min-w-0 space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    )
  }

  return (
    <TagFormProvider value={{ tag }}>
      <Form {...form}>
        <FieldUserId />
        <FieldMeta />
        <FieldPostTags />
        <form method="POST" noValidate>
          <div className="relative grid lg:grid-cols-[1fr_280px] lg:gap-8">
            <div className="space-y-4">
              <FieldName />
              <MetaboxSlug />
              <MetaboxDescription />
            </div>
            <div className="space-y-0">
              <MetaboxPublish />
            </div>
          </div>
        </form>
      </Form>
    </TagFormProvider>
  )
}

export { TagForm }
