import * as React from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'

import { cn, getPostUrl, getAuthorUrl } from '@/lib/utils'
import { Post } from '@/types/database'

interface LatestPostsOptions {
  hideTitle?: boolean
  hideExcerpt?: boolean
  hideDate?: boolean
  hideAuthor?: boolean
  classNameItem?: string
  classNameTitle?: string
  classNameExcerpt?: string
  classNameDate?: string
  classNameAuthor?: string
}

interface LatestPostsProps extends React.HTMLAttributes<HTMLDivElement> {
  posts: Post[] | null
  options?: LatestPostsOptions
}

const LatestPosts = (props: LatestPostsProps) => {
  const { className, posts, options, ...rest } = props

  return (
    <div className={cn('gap-8 space-y-8', className)} {...rest}>
      {Array.isArray(posts) && posts?.length > 0 ? (
        posts?.map((post: Post) => (
          <LatestItem key={post?.id} post={post} options={options} />
        ))
      ) : (
        <EmptyItem />
      )}
    </div>
  )
}

interface LatestItemProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post
  options?: LatestPostsOptions
}

const LatestItem = (props: LatestItemProps) => {
  const { post, options, ...rest } = props

  return (
    <div className={cn('space-y-2', options?.classNameItem)} {...rest}>
      {!options?.hideTitle ? (
        <h3
          className={cn(
            'font-serif text-3xl hover:underline',
            options?.classNameTitle
          )}
        >
          <Link href={getPostUrl(post) ?? '#'}>{post?.title}</Link>
        </h3>
      ) : null}
      {!options?.hideExcerpt ? (
        <p className={cn('line-clamp-3', options?.classNameExcerpt)}>
          {post?.excerpt}
        </p>
      ) : null}
      {!options?.hideDate || !options?.hideAuthor ? (
        <div className="space-x-1 text-sm">
          {!options?.hideDate ? (
            <time
              dateTime={post?.date ?? undefined}
              className={cn(options?.classNameDate)}
            >
              {dayjs(post?.date).format('MMMM D, YYYY')}
            </time>
          ) : null}
          {!options?.hideAuthor ? (
            <>
              <span>— by</span>
              <Link
                href={getAuthorUrl(post) ?? '#'}
                className={cn('hover:underline', options?.classNameAuthor)}
              >
                {post?.author?.full_name ?? post?.author?.username}
              </Link>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

const EmptyItem = () => {
  return <div>No posts yet.</div>
}

export { LatestPosts, type LatestPostsProps, type LatestPostsOptions }
