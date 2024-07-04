'use client'

import * as React from 'react'
import Link from 'next/link'

import { getPostUrl } from '@/lib/utils'
import { Post } from '@/types/database'
import { usePostsAPI } from '@/queries/client/posts'

interface LatestPostsProps extends React.HTMLAttributes<HTMLDivElement> {
  userId: string | null
  page?: number
  perPage?: number
  postType?: string
  status?: string
  q?: string
  orderBy?: string
  order?: 'asc' | 'desc'
  limit?: number
}

const LatestPosts = ({
  userId,
  page = 1,
  perPage = 10,
  postType = 'post',
  status = 'publish',
  q,
  orderBy = 'id',
  order = 'desc',
  limit,
  ...props
}: LatestPostsProps) => {
  const { posts } = usePostsAPI(userId, {
    page,
    perPage,
    postType,
    status,
    q,
    orderBy,
    order,
    limit,
  })

  return (
    <div className="space-y-2" {...props}>
      {Array.isArray(posts) && posts?.length > 0 ? (
        posts?.map((post: Post) => <LatestItem key={post?.id} post={post} />)
      ) : (
        <EmptyItem />
      )}
    </div>
  )
}

interface LatestItemProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post
}

const LatestItem = ({ post, ...props }: LatestItemProps) => {
  return (
    <div className="text-sm leading-4" {...props}>
      <span>&bull;&nbsp;</span>
      <span className="font-serif hover:underline">
        <Link href={getPostUrl(post) ?? '#'}>{post?.title}</Link>
      </span>
    </div>
  )
}

const EmptyItem = () => {
  return <div>No posts yet</div>
}

export { LatestPosts, type LatestPostsProps }
