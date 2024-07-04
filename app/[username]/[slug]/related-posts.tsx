import * as React from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'

import { getPostUrl } from '@/lib/utils'
import { Post } from '@/types/database'

interface RelatedPostsProps extends React.HTMLAttributes<HTMLDivElement> {
  previousPost: Post | null
  nextPost: Post | null
}

const RelatedPosts = ({
  previousPost,
  nextPost,
  ...props
}: RelatedPostsProps) => {
  return (
    <div {...props}>
      <h2 className="mb-8 font-serif text-4xl font-bold leading-tight tracking-tighter">
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
      <h3 className="line-clamp-2 font-serif text-2xl underline hover:no-underline">
        <Link href={getPostUrl(post) ?? '#'}>{post?.title}</Link>
      </h3>
      <time dateTime={post?.date ?? undefined}>
        {dayjs(post?.date).format('MMMM D, YYYY')}
      </time>
    </div>
  )
}

const NextPost = ({ post }: { post: Post | null }) => {
  if (!post) {
    return <div className="text-center">The next post does not exist.</div>
  }

  return (
    <div className="grid gap-2">
      <h3 className="line-clamp-2 font-serif text-2xl underline hover:no-underline">
        <Link href={getPostUrl(post) ?? '#'}>{post?.title}</Link>
      </h3>
      <time dateTime={post?.date ?? undefined}>
        {dayjs(post?.date).format('MMMM D, YYYY')}
      </time>
    </div>
  )
}

export { RelatedPosts, type RelatedPostsProps }
