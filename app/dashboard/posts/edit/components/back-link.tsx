import * as React from 'react'
import Link from 'next/link'

import { LucideIcon } from '@/lib/lucide-icon'

export function BackLink() {
  return (
    <Link href="/dashboard/posts" className="hover:text-muted-foreground">
      <LucideIcon name="ChevronLeft" className="size-6 min-w-6" />
    </Link>
  )
}
