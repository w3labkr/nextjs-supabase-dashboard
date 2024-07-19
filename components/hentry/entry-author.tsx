import * as React from 'react'
import Link, { type LinkProps } from 'next/link'

import { cn } from '@/lib/utils'
import { type Author } from '@/types/database'

interface EntryAuthorProps
  extends LinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  author: Author | null
}

const EntryAuthor = ({ className, author, ...props }: EntryAuthorProps) => {
  return (
    <Link className={cn('hover:underline', className)} {...props}>
      {author?.full_name ?? author?.username}
    </Link>
  )
}

export { EntryAuthor, type EntryAuthorProps }
