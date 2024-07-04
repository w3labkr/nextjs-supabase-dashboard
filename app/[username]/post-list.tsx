'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import dayjs from 'dayjs'
import { Paging, PagingProvider } from '@/components/paging'

import { getPostUrl } from '@/lib/utils'
import { Post } from '@/types/database'
import { useAuth } from '@/hooks/use-auth'
import { usePostsAPI } from '@/queries/client/posts'

interface PostListProps extends React.HTMLAttributes<HTMLDivElement> {}

const PostList = (props: PostListProps) => {
  const { t } = useTranslation()

  const searchParams = useSearchParams()
  const page = +((searchParams.get('page') as string) ?? '1')
  const perPage = +((searchParams.get('perPage') as string) ?? '10')
  const pageSize = +((searchParams.get('pageSize') as string) ?? '10')
  const postType = 'post'
  const status = 'publish'
  const q = searchParams.get('q') as string
  const orderBy = (searchParams.get('orderBy') as string) ?? 'id'
  const order = (searchParams.get('order') as string) ?? 'desc'

  const { user } = useAuth()
  const { posts, count } = usePostsAPI(user?.id ?? null, {
    page,
    perPage,
    postType,
    status,
    q,
    orderBy,
    order,
  })

  const total = count ?? 0

  if (Array.isArray(posts) && posts?.length === 0) {
    return (
      <div {...props}>
        <div className="py-4">{t('no_posts_yet')}</div>
      </div>
    )
  }

  return (
    <PagingProvider value={{ total, page, perPage, pageSize }}>
      <div {...props}>
        <div className="grid grid-cols-1">
          {posts?.map((post: Post) => <PostItem key={post?.id} post={post} />)}
        </div>
        <Paging />
      </div>
    </PagingProvider>
  )
}

interface PostItemProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post
}

const PostItem = ({ post, ...props }: PostItemProps) => {
  return (
    <div className="space-y-2 border-b py-4" {...props}>
      <h3 className="line-clamp-2 font-serif text-3xl hover:underline">
        <Link href={getPostUrl(post) ?? '#'}>{post?.title}</Link>
      </h3>
      <p className="line-clamp-3">{post?.description}</p>
      <div className="space-x-1 text-sm">
        <time dateTime={post?.date ?? undefined}>
          {dayjs(post?.date).format('MMMM D, YYYY')}
        </time>
      </div>
    </div>
  )
}

export { PostList, type PostListProps }
