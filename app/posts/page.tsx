import * as React from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Paging, PagingProvider } from '@/components/paging'

import { getPostsAPI } from '@/queries/server/posts'
import { getAuthorUrl, getPostUrl } from '@/lib/utils'
import { getTranslation } from '@/hooks/i18next'
import { Post } from '@/types/database'

// revalidate the data at most every week
// 3600 (hour), 86400 (day), 604800 (week), 2678400 (month), 31536000 (year)
export const revalidate = 0

export default async function PostsPage({
  searchParams,
}: {
  searchParams?: {
    page?: string
    perPage?: string
    pageSize?: string
    q?: string
    orderBy?: string
    order?: string
  }
}) {
  const page = +(searchParams?.page ?? '1')
  const perPage = +(searchParams?.perPage ?? '10')
  const pageSize = +(searchParams?.pageSize ?? '10')
  const q = searchParams?.q
  const orderBy = searchParams?.orderBy ?? 'id'
  const order = searchParams?.order ?? 'desc'

  const { posts, count } = await getPostsAPI(null, {
    page,
    perPage,
    postType: 'post',
    status: 'publish',
    q,
    orderBy,
    order,
  })

  const total = count ?? 0
  const { t } = await getTranslation()

  return (
    <>
      <Header />
      <main className="min-h-[80vh] pb-20 sm:pb-40">
        <div className="container flex-1 overflow-auto">
          <h2 className="mt-16 text-center font-serif text-4xl font-bold">
            {t('posts')}
          </h2>
          <PagingProvider value={{ total, page, perPage, pageSize }}>
            <div className="mt-12 space-y-16">
              {Array.isArray(posts) && posts?.length > 0 ? (
                <>
                  <PostList posts={posts} />
                  <Paging />
                </>
              ) : (
                <div className="text-center">{t('no_posts_yet')}</div>
              )}
            </div>
          </PagingProvider>
        </div>
      </main>
      <Footer />
    </>
  )
}

interface PostListProps extends React.HTMLAttributes<HTMLDivElement> {
  posts: Post[]
}

const PostList = ({ posts, ...props }: PostListProps) => {
  return (
    <div
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
      {...props}
    >
      {posts?.map((post: Post) => <PostItem key={post?.id} post={post} />)}
    </div>
  )
}

interface PostItemProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post
}

const PostItem = ({ post, ...props }: PostItemProps) => {
  return (
    <div className="space-y-2" {...props}>
      <div className="h-40 bg-secondary"></div>
      <h3 className="line-clamp-2 font-serif text-3xl hover:underline">
        <Link href={getPostUrl(post) ?? '#'}>{post?.title}</Link>
      </h3>
      <p className="line-clamp-3">{post?.description}</p>
      <div className="space-x-1 text-sm">
        <time dateTime={post?.date ?? undefined}>
          {dayjs(post?.date).format('MMMM D, YYYY')}
        </time>
        <span>— by</span>
        <Link href={getAuthorUrl(post) ?? '#'} className="hover:underline">
          {post?.author?.full_name ?? post?.author?.username}
        </Link>
      </div>
    </div>
  )
}
