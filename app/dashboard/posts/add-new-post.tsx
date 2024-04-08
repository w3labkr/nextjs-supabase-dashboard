'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { cn, fetcher } from '@/lib/utils'
import { LucideIcon } from '@/lib/lucide-icon'
import { toast } from 'sonner'
import { ButtonProps, buttonVariants } from '@/components/ui/button'

import { PostAPI } from '@/types/api'
import { useAuth } from '@/hooks/use-auth'

type FormValues = Partial<PostAPI>

export function AddNewPost({ className, variant, ...props }: ButtonProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const { user } = useAuth()

  const values: FormValues = {
    user_id: user?.id,
    title: 'Untitled Post',
  }

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async function (formValues: FormValues) {
    try {
      setIsSubmitting(true)

      const result = await fetcher<PostAPI>(`/api/v1/post/new/${user?.id}`, {
        method: 'PUT',
        body: JSON.stringify(formValues),
      })
      console.log(result)
      if (result?.error) throw new Error(result?.error?.message)

      const post = result?.data
      router.push(`/dashboard/posts/${post?.id}`)
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button
      onClick={() => handleClick(values)}
      className={cn(
        buttonVariants({ variant }),
        { 'cursor-not-allowed opacity-60': isSubmitting },
        className
      )}
      disabled={isSubmitting}
      {...props}
    >
      {isSubmitting ? (
        <LucideIcon name="LoaderCircle" className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LucideIcon name="Plus" className="mr-2 h-4 w-4" />
      )}
      {t('AddNewPost.label')}
    </button>
  )
}
