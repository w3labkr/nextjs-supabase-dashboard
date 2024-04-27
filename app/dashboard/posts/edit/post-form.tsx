'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Form } from '@/components/ui/form'
import {
  MetaboxSlug,
  MetaboxExcerpt,
  MetaboxRevisions,
  MetaboxThumbnail,
  MetaboxPublish,
} from './components/metabox'
import { TitleField } from './components/field'
import { Permalink } from './components/permalink'

import { usePostAPI } from '@/queries/sync'
import { PostFormProvider } from './components/post-form-provider'

const Editor = dynamic(() => import('./components/editor'), { ssr: false })

const FormSchema = z.object({
  title: z.string().nonempty(),
  slug: z.string().nonempty(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
})

export type FormValues = z.infer<typeof FormSchema>

export function PostForm({ id }: { id: string }) {
  const { post } = usePostAPI(id)

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: {
      slug: post?.slug ?? '',
      title: post?.title ?? '',
      content: post?.content ?? '',
      excerpt: post?.excerpt ?? '',
    },
    shouldUnregister: true,
  })

  return (
    <PostFormProvider value={{ form, post }}>
      <Form {...form}>
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
              <MetaboxThumbnail />
            </div>
          </div>
        </form>
      </Form>
    </PostFormProvider>
  )
}
