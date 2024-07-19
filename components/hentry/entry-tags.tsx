import * as React from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

import { absoluteUrl, cn, getMetaValue } from '@/lib/utils'
import { type Tag } from '@/lib/emblor'
import { type PostMeta } from '@/types/database'

interface EntryTagsProps extends React.HTMLAttributes<HTMLDivElement> {
  pathname?: string
  meta?: PostMeta[]
}

const EntryTags = ({ className, meta, pathname, ...props }: EntryTagsProps) => {
  const tags: Tag[] = JSON.parse(getMetaValue(meta, 'tags', '[]'))

  if (Array.isArray(tags) && tags?.length === 0) {
    return null
  }

  return (
    <div className={cn('flex w-full flex-wrap gap-1', className)} {...props}>
      {tags?.map((tag: Tag) => (
        <Link
          key={tag?.id}
          href={
            pathname && tag?.slug
              ? absoluteUrl(`${pathname}?tag=${tag?.slug}`)
              : '#'
          }
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-auto px-2 py-1 text-xs'
          )}
        >
          {tag?.text}
        </Link>
      ))}
    </div>
  )
}

export { EntryTags, type EntryTagsProps }
