import * as React from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'

import { cn, absoluteUrl } from '@/lib/utils'
import { Paging } from '@/components/paging'

import { Post } from '@/types/database'

export function LatestPosts({
  posts,
  className,
}: {
  posts: Post[]
  className?: string
}) {
  return (
    <div className="space-y-16">
      <div className={cn('columns-1 gap-8 space-y-8', className)}>
        {posts?.map((post: Post) => <PostItem key={post?.id} post={post} />)}
      </div>
      <Paging />
    </div>
  )
}

function PostItem({ post }: { post: Post }) {
  return (
    <div className="grid gap-2">
      <PostTitle post={post} />
      <PostSummary post={post} />
      <PostMeta post={post} />
    </div>
  )
}

function PostTitle({ post }: { post: Post }) {
  const username = post?.profile?.username
  const slug = post?.slug
  const permalink = absoluteUrl(`/${username}/posts/${slug}`)

  return (
    <h3 className="font-serif text-3xl hover:underline">
      <Link href={permalink}>{post?.title}</Link>
    </h3>
  )
}

function PostSummary({ post }: { post: Post }) {
  if (!post?.excerpt) return null

  return <p className="line-clamp-3">{post?.excerpt}</p>
}

function PostMeta({ post }: { post: Post }) {
  return (
    <div className="space-x-1 text-sm">
      <time dateTime={post?.published_at ?? undefined}>
        {dayjs(post?.published_at).format('MMMM D, YYYY')}
      </time>
      <span>— by</span>
      <Link
        href={`/${post?.profile?.username}`}
        className="underline-offset-4 hover:underline"
      >
        {post?.profile?.full_name}
      </Link>
    </div>
  )
}
