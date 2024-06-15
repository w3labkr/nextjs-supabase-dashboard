import * as React from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'

import { getPostUrl } from '@/lib/utils'
import { siteConfig } from '@/config/site'
import { Post } from '@/types/database'

interface RelatedPostsProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  previousPost: Post | null
  nextPost: Post | null
}

const RelatedPosts = ({
  className,
  previousPost,
  nextPost,
  ...props
}: RelatedPostsProps) => {
  return (
    <div className={className} {...props}>
      <h2 className="mb-8 font-serif text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        Related Posts
      </h2>
      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
        <PreviousPost post={previousPost} />
        <NextPost post={nextPost} />
      </div>
    </div>
  )
}

const PreviousPost = ({ post }: { post: Post | null }) => {
  if (!post) {
    return <div className="text-center">The previous post does not exist.</div>
  }

  return (
    <div className="grid gap-2">
      <h3 className="line-clamp-2 font-serif text-3xl hover:underline">
        <Link href={getPostUrl(post) ?? '#'} scroll={!siteConfig?.fixedHeader}>
          {post?.title}
        </Link>
      </h3>
      <time dateTime={post?.date ?? undefined}>
        {dayjs(post?.date).format('MMMM D, YYYY')}
      </time>
      <p className="line-clamp-3">{post?.excerpt}</p>
    </div>
  )
}

const NextPost = ({ post }: { post: Post | null }) => {
  if (!post) {
    return <div className="text-center">The next post does not exist.</div>
  }

  return (
    <div className="grid gap-2">
      <h3 className="line-clamp-2 font-serif text-3xl hover:underline">
        <Link href={getPostUrl(post) ?? '#'} scroll={!siteConfig?.fixedHeader}>
          {post?.title}
        </Link>
      </h3>
      <time dateTime={post?.date ?? undefined}>
        {dayjs(post?.date).format('MMMM D, YYYY')}
      </time>
      <p className="line-clamp-3">{post?.excerpt}</p>
    </div>
  )
}

export { RelatedPosts, type RelatedPostsProps }
