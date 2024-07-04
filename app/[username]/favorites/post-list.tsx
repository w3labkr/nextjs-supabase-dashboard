'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import dayjs from 'dayjs'
import { Paging, PagingProvider } from '@/components/paging'

import { getAuthorUrl, getPostUrl } from '@/lib/utils'
import { useFavoritePostsAPI } from '@/queries/client/favorites'
import { Author, Post, User } from '@/types/database'

interface PostListProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User
}

const PostList = ({ user, ...props }: PostListProps) => {
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

  const { posts, count } = useFavoritePostsAPI(user?.id ?? null, {
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
      <PostTitle post={post} />
      <PostDescription description={post?.description} />
      <div className="space-x-1 text-sm">
        <PostDate date={post?.date} />
        <span>— by</span>
        <PostAuthor author={post?.author} />
      </div>
    </div>
  )
}

const PostTitle = ({ post }: { post: Post }) => {
  return (
    <h3 className="line-clamp-2 font-serif text-3xl hover:underline">
      <Link href={getPostUrl(post) ?? '#'}>{post?.title}</Link>
    </h3>
  )
}

const PostDescription = ({ description }: { description: string | null }) => {
  return <p className="line-clamp-3">{description}</p>
}

const PostDate = ({ date }: { date: string | null }) => {
  return (
    <time dateTime={date ?? undefined}>
      {dayjs(date).format('MMMM D, YYYY')}
    </time>
  )
}

const PostAuthor = ({ author }: { author: Author | null }) => {
  return (
    <Link
      href={getAuthorUrl(null, { username: author?.username }) ?? '#'}
      className="underline hover:no-underline"
    >
      {author?.full_name}
    </Link>
  )
}

export { PostList, type PostListProps }
