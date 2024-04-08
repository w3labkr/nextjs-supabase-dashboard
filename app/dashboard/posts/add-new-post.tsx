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

interface FormValues {
  title: string
}

export function AddNewPost({ className, variant, ...props }: ButtonProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const { user } = useAuth()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async function () {
    try {
      setIsSubmitting(true)

      if (!user?.id) throw new Error('Require is not defined.')

      const formValues: FormValues = { title: 'Untitled Post' }
      const result = await fetcher<PostAPI>(`/api/v1/post/new/${user?.id}`, {
        method: 'PUT',
        body: JSON.stringify(formValues),
      })

      if (result?.error) throw new Error(result?.error?.message)

      router.push(`/dashboard/posts/${result?.data?.id}`)
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button
      onClick={handleClick}
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
