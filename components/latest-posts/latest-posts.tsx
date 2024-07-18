'use client'

import * as React from 'react'
import Link from 'next/link'

import { absoluteUrl } from '@/lib/utils'
import { Post } from '@/types/database'
import { usePostsAPI } from '@/queries/client/posts'

interface LatestPostsProps extends React.HTMLAttributes<HTMLDivElement> {
  userId: string | null
  postType?: string
  status?: string
  q?: string
  orderBy?: string
  order?: 'asc' | 'desc'
  perPage?: number
  page?: number
  limit?: number
}

const LatestPosts = ({
  userId,
  postType = 'post',
  status = 'publish',
  q,
  orderBy = 'id',
  order = 'desc',
  perPage = 10,
  page = 1,
  limit,
  ...props
}: LatestPostsProps) => {
  const { posts } = usePostsAPI(userId, {
    postType,
    status,
    q,
    orderBy,
    order,
    perPage,
    page,
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
        <Link href={post?.permalink ?? '#'}>{post?.title}</Link>
      </span>
    </div>
  )
}

const EmptyItem = () => {
  return <div>No posts yet</div>
}

export { LatestPosts, type LatestPostsProps }
