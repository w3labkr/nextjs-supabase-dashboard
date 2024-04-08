import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

import { Post } from '@/types/database'

export function EditPost({ post }: { post: Post }) {
  return (
    <Link
      href={`/dashboard/posts/${post?.id}`}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'h-auto p-0 text-xs font-normal text-blue-700 hover:underline'
      )}
    >
      Edit
    </Link>
  )
}
