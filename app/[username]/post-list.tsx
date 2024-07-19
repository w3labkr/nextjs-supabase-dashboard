'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { Paging, PagingProvider } from '@/components/paging'
import {
  EntryTitle,
  EntrySummary,
  EntryPublished,
  EntryTags,
} from '@/components/hentry'

import { type Post, type User } from '@/types/database'
import { usePostsAPI } from '@/queries/client/posts'

interface PostListProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User
}

const PostList = ({ user, ...props }: PostListProps) => {
  const { t } = useTranslation()

  const searchParams = useSearchParams()
  const postType = 'post'
  const status = 'publish'
  const tag = searchParams.get('tag') as string
  const q = searchParams.get('q') as string
  const orderBy = (searchParams.get('orderBy') as string) ?? 'id'
  const order = (searchParams.get('order') as string) ?? 'desc'
  const perPage = +((searchParams.get('perPage') as string) ?? '10')
  const page = +((searchParams.get('page') as string) ?? '1')
  const pageSize = +((searchParams.get('pageSize') as string) ?? '10')

  const { posts, count } = usePostsAPI(user?.id ?? null, {
    postType,
    status,
    tag,
    q,
    orderBy,
    order,
    perPage,
    page,
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
  const username = post?.author?.username
  const slug = post?.slug

  return (
    <div
      className="flex flex-row flex-wrap gap-4 border-b py-4 md:flex-col"
      {...props}
    >
      <EntryTitle href={post?.permalink ?? '#'} text={post?.title} />
      <EntrySummary text={post?.description} />
      <EntryTags
        pathname={username ? `/${username}` : undefined}
        meta={post?.meta}
      />
      <div className="w-full text-sm">
        <EntryPublished dateTime={post?.date ?? undefined} />
      </div>
    </div>
  )
}

export { PostList, type PostListProps }
