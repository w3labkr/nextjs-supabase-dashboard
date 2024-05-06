'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import dynamic from 'next/dynamic'

import { useForm, UseFormReturn } from 'react-hook-form'
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
} from './components/metaboxes'
import { Permalink } from './components/permalink'

import { usePostAPI } from '@/queries/sync'

const Editor = dynamic(() => import('./components/editor'), { ssr: false })

const FormSchema = z.object({
  user_id: z.string().uuid(),
  title: z.string().nonempty(),
  slug: z.string().nonempty(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
})

type FormValues = z.infer<typeof FormSchema>

const PostForm = ({ id }: { id: number }) => {
  const { post } = usePostAPI(id)
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: {
      user_id: post?.user_id ?? '',
      slug: post?.slug ?? '',
      title: post?.title ?? '',
      content: post?.content ?? '',
      excerpt: post?.excerpt ?? '',
    },
    shouldUnregister: true,
  })

  return (
    <Form {...form}>
      <UserIdField form={form} />
      <form method="POST" noValidate>
        <div className="relative grid gap-10 md:grid-cols-[1fr_280px]">
          <div className="mx-auto w-full min-w-0 space-y-6">
            <div className="space-y-2">
              <TitleField form={form} />
              <Permalink form={form} post={post} />
            </div>
            <Editor form={form} post={post} />
            <MetaboxSlug form={form} post={post} />
            <MetaboxExcerpt form={form} post={post} />
            {/* <MetaboxRevisions form={form} post={post} /> */}
          </div>
          <div className="space-y-0">
            <MetaboxPublish form={form} post={post} />
            <MetaboxThumbnail form={form} post={post} />
          </div>
        </div>
      </form>
    </Form>
  )
}

const UserIdField = ({ form }: { form: UseFormReturn<FormValues> }) => {
  return (
    <FormField
      control={form.control}
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

const TitleField = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const { t } = useTranslation()

  return (
    <FormField
      control={form.control}
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

export { PostForm, type FormValues }
