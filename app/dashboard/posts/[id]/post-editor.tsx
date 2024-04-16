'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import EditorJS from '@editorjs/editorjs'
import TextareaAutosize from 'react-textarea-autosize'

import { cn, fetcher } from '@/lib/utils'
import { toast } from 'sonner'
import { LucideIcon } from '@/lib/lucide-icon'
import { buttonVariants } from '@/components/ui/button'

import useSWRMutation from 'swr/mutation'
import { usePost } from '@/hooks/api'

import './editor.css'

const FormSchema = z.object({
  user_id: z.string().uuid().optional(),
  title: z.string().min(3).max(128).optional(),
  content: z.any().optional(),
})

type FormValues = z.infer<typeof FormSchema>

async function sendRequest(url: string, { arg }: { arg: FormValues }) {
  return await fetcher(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  })
}

export function PostEditor({ id }: { id: string }) {
  const router = useRouter()
  const ref = React.useRef<EditorJS>()

  const { post } = usePost(id)
  const { trigger } = useSWRMutation(`/api/v1/post/${id}`, sendRequest)

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
  })

  const [isMounted, setIsMounted] = React.useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const initializeEditor = React.useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default
    const Header = (await import('@editorjs/header')).default
    const Embed = (await import('@editorjs/embed')).default
    const Table = (await import('@editorjs/table')).default
    const List = (await import('@editorjs/list')).default
    const Code = (await import('@editorjs/code')).default
    const LinkTool = (await import('@editorjs/link')).default
    const InlineCode = (await import('@editorjs/inline-code')).default

    const body = FormSchema.parse({
      title: post?.title,
      content: post?.content,
    })

    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          ref.current = editor
        },
        placeholder: 'Type here to write your post...',
        inlineToolbar: true,
        data: body.content ?? {},
        tools: {
          header: Header,
          linkTool: LinkTool,
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      })
    }
  }, [post])

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true)
    }
  }, [])

  React.useEffect(() => {
    if (isMounted) {
      initializeEditor()

      return () => {
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  const onSubmit = async (formValues: FormValues) => {
    try {
      setIsSubmitting(true)

      if (!post?.user_id) throw new Error('Require is not defined.')

      const blocks = await ref.current?.save()
      const result = await trigger({
        user_id: post?.user_id,
        title: formValues?.title,
        content: blocks,
      })

      if (result?.error) throw new Error(result?.error?.message)

      router.refresh()

      toast.success('Your post has been saved.')
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isMounted) return null

  return (
    <form method="POST" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="grid w-full gap-10">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link
              href="/dashboard/posts"
              className={cn(buttonVariants({ variant: 'ghost' }))}
            >
              <>
                <LucideIcon
                  name="ChevronLeft"
                  className="mr-2 size-4 min-w-4"
                />
                Back
              </>
            </Link>
            <p className="text-sm text-muted-foreground">{post?.status}</p>
          </div>
          <button type="submit" className={cn(buttonVariants())}>
            {isSubmitting && (
              <LucideIcon
                name="LoaderCircle"
                className="mr-2 size-4 min-w-4 animate-spin"
              />
            )}
            <span>Save</span>
          </button>
        </div>
        <div className="prose prose-stone dark:prose-invert mx-auto w-[800px]">
          <TextareaAutosize
            autoFocus
            id="title"
            defaultValue={post?.title ?? undefined}
            placeholder="Post title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
            {...form.register('title')}
          />
          <div id="editor" className="min-h-[500px]" />
          <p className="text-sm text-gray-500">
            Use{' '}
            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
              Tab
            </kbd>{' '}
            to open the command menu.
          </p>
        </div>
      </div>
    </form>
  )
}
