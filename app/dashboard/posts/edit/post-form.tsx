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
import {
  MetaboxSlug,
  MetaboxExcerpt,
  MetaboxRevisions,
  MetaboxThumbnail,
  MetaboxPublish,
  MetaboxRectriction,
} from './components/metaboxes'
import { Permalink } from './components/permalink'
import { PostFormProvider } from './context/post-form-provider'

import { usePostAPI } from '@/queries/client/posts'

const Editor = dynamic(() => import('./components/editor'), { ssr: false })

const FormSchema = z.object({
  user_id: z.string().nonempty().uuid(),
  status: z.string().nonempty(),
  title: z.string().nonempty(),
  slug: z.string().nonempty(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  thumbnail_url: z.string().optional(),
})

type FormValues = z.infer<typeof FormSchema>

const PostForm = ({ id }: { id: number }) => {
  const { post } = usePostAPI(id)

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: {
      user_id: post?.user_id ?? '',
      status: post?.status ?? '',
      slug: post?.slug ?? '',
      title: post?.title ?? '',
      content: post?.content ?? '',
      excerpt: post?.excerpt ?? '',
      thumbnail_url: post?.thumbnail_url ?? '',
    },
    shouldUnregister: true,
  })

  return (
    <PostFormProvider value={{ post }}>
      <Form {...form}>
        <UserIdField />
        <StatusField />
        <form method="POST" noValidate>
          <div className="relative grid gap-10 md:grid-cols-[1fr_280px]">
            <div className="mx-auto w-full min-w-0 space-y-6">
              <div className="space-y-2">
                <TitleField />
                <Permalink />
              </div>
              <Editor />
              <MetaboxSlug />
              <MetaboxExcerpt />
              {/* <MetaboxRevisions /> */}
            </div>
            <div className="space-y-0">
              <MetaboxPublish />
              <MetaboxRectriction />
              <MetaboxThumbnail />
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
            <Input type="hidden" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

const StatusField = () => {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input type="hidden" {...field} />
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
            <Input placeholder={t('Input.please_enter_your_text')} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { PostForm }
