'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import dynamic from 'next/dynamic'

import { useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  MetaboxSlug,
  MetaboxPermalink,
  MetaboxDescription,
  MetaboxKeywords,
  MetaboxRevisions,
  MetaboxThumbnail,
  MetaboxPublish,
  MetaboxRectriction,
  MetaboxFutureDate,
  MetaboxTags,
} from './components/metaboxes'
import { PostFormProvider } from './context/post-form-provider'

import { usePostAPI } from '@/queries/client/posts'

const Editor = dynamic(() => import('./components/editor'), {
  ssr: false,
  loading: () => <Skeleton className="h-96 w-full" />,
})

const FormSchema = z.object({
  user_id: z.string().nonempty().uuid(),
  date: z.string().datetime({ offset: true }).optional(),
  title: z.string().nonempty(),
  slug: z.string().nonempty(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  content: z.string().optional(),
  thumbnail_url: z.string().optional(),
  permalink: z.string().nonempty(),
  meta: z.array(z.record(z.string(), z.any())).optional(),
})

type FormValues = z.infer<typeof FormSchema>

const PostForm = ({ id }: { id: number }) => {
  const { post, isLoading } = usePostAPI(id)

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: {
      user_id: post?.user_id ?? '',
      date: post?.date ?? '',
      title: post?.title ?? '',
      slug: post?.slug ?? '',
      description: post?.description ?? '',
      keywords: post?.keywords ?? '',
      content: post?.content ?? '',
      thumbnail_url: post?.thumbnail_url ?? '',
      permalink: post?.permalink ?? '',
      meta: post?.meta ?? [],
    },
    shouldUnregister: true,
  })

  if (isLoading) {
    return (
      <div className="relative grid gap-10 lg:grid-cols-[1fr_280px]">
        <div className="mx-auto w-full min-w-0 space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  return (
    <PostFormProvider value={{ post }}>
      <Form {...form}>
        <UserIdField />
        <MetaField />
        <form method="POST" noValidate>
          <div className="relative grid lg:grid-cols-[1fr_280px] lg:gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <TitleField />
                {/* <Permalink className="text-sm" /> */}
                <MetaboxPermalink className="text-sm" />
              </div>
              <Editor />
              <div>
                <MetaboxSlug />
                <MetaboxDescription />
                <MetaboxKeywords />
                {/* <MetaboxRevisions /> */}
              </div>
            </div>
            <div className="space-y-0">
              <MetaboxPublish />
              <MetaboxFutureDate />
              <MetaboxRectriction />
              <MetaboxThumbnail />
              <MetaboxTags />
            </div>
          </div>
        </form>
      </Form>
    </PostFormProvider>
  )
}

const UserIdField = () => {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="user_id"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <input type="hidden" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

const MetaField = () => {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="meta"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <input type="hidden" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

const TitleField = () => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input placeholder={t('please_enter_your_text')} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { PostForm }
