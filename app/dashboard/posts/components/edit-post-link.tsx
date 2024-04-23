'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import Link, { LinkProps } from 'next/link'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { usePostItem } from './post-item-provider'

interface EditPostLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  text?: string
}

export function EditPostLink({
  children,
  className,
  text,
  translate,
}: EditPostLinkProps) {
  const { t } = useTranslation()
  const { post } = usePostItem()

  return (
    <Link
      href={`/dashboard/posts/edit?id=${post?.id}`}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'h-auto p-0 text-xs font-normal hover:underline',
        className
      )}
    >
      {text && translate === 'yes' ? t(text) : text}
      {children}
    </Link>
  )
}
