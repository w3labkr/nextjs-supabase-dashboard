import * as React from 'react'
import Link from 'next/link'

import { cn, fetcher } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

import { Post } from '@/types/database'

export function ViewPost({ post }: { post: Post }) {
  return <span className="text-xs">View</span>
}
