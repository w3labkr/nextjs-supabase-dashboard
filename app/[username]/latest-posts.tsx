import * as React from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'

import { absoluteUrl } from '@/lib/utils'
import { Paging } from '@/components/paging'

import { Post } from '@/types/database'

export function LatestPosts({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-y-4">
        {posts?.map((post: Post) => <PostItem key={post?.id} post={post} />)}
      </div>
      <Paging />
    </div>
  )
}

function PostItem({ post }: { post: Post }) {
  const username = post?.profile?.username
  const slug = post?.slug
  const permalink = absoluteUrl(`/${username}/${slug}`)

  return (
    <div>
      <h3 className="text-3xl hover:underline">
        <Link href={permalink}>{post?.title}</Link>
      </h3>
      <time dateTime={post?.published_at ?? undefined}>
        {dayjs(post?.published_at).format('MMMM D, YYYY')}
      </time>
    </div>
  )
}
