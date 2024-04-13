'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

import { Post } from '@/types/database'

export function EditPostButton({ post }: { post: Post }) {
  const { t } = useTranslation()

  return (
    <Link
      href={`/dashboard/posts/${post?.id}`}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'h-auto p-0 text-xs font-normal text-blue-700 hover:underline'
      )}
    >
      {t('PostList.EditPostButton')}
    </Link>
  )
}
