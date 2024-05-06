import * as React from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'

import { cn, getPostUrl, getUserUrl } from '@/lib/utils'
import { Paging } from '@/components/paging'

import { Post } from '@/types/database'

interface LatestPostsProps {
  posts: Post[] | null
  className?: string
}

const LatestPosts = (props: LatestPostsProps) => {
  const { posts, className } = props

  return (
    <div className="space-y-16">
      <div className={cn('columns-1 gap-8 space-y-8', className)}>
        {posts && posts?.length > 0 ? (
          posts?.map((post: Post) => <PostItem key={post?.id} post={post} />)
        ) : (
          <EmptyItem />
        )}
      </div>
      {posts && posts?.length > 0 ? <Paging /> : null}
    </div>
  )
}

const PostItem = ({ post }: { post: Post }) => {
  const datetime = post?.published_at ?? post?.created_at ?? undefined

  return (
    <div className="grid gap-2">
      <h3 className="font-serif text-3xl hover:underline">
        <Link href={getPostUrl(post) ?? '#'}>{post?.title}</Link>
      </h3>
      {post?.excerpt ? <p className="line-clamp-3">{post?.excerpt}</p> : null}
      <div className="space-x-1 text-sm">
        <time dateTime={datetime}>
          {dayjs(datetime).format('MMMM D, YYYY')}
        </time>
        <span>— by</span>
        <Link
          href={getUserUrl(post?.profile?.username) ?? '#'}
          className="hover:underline"
        >
          {post?.profile?.full_name}
        </Link>
      </div>
    </div>
  )
}

const EmptyItem = () => {
  return <div>No posts yet.</div>
}

export { LatestPosts, type LatestPostsProps }
