import * as React from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Paging, PagingProvider } from '@/components/paging'
import { ArchiveTitle } from './archive-title'
import { EmptyPosts } from './empty-posts'

import { getPostsAPI } from '@/queries/server/posts'
import { cn, getAuthorUrl, getPostUrl } from '@/lib/utils'
import { siteConfig } from '@/config/site'
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

  return (
    <>
      <Header />
      <main
        className={cn(
          'min-h-[80vh] pb-40',
          siteConfig?.fixedHeader ? 'pt-[61px]' : ''
        )}
      >
        <div className="container flex-1 overflow-auto">
          <ArchiveTitle
            q={q}
            className="mt-16 text-center font-serif text-4xl font-bold"
          />
          <PagingProvider value={{ total, page, perPage, pageSize }}>
            <div className="mt-12 space-y-16">
              {Array.isArray(posts) && posts?.length > 0 ? (
                <>
                  <PostList posts={posts} />
                  <Paging />
                </>
              ) : (
                <EmptyPosts q={q} className="text-center" />
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
      <h3 className="line-clamp-2 font-serif text-3xl hover:underline">
        <Link href={getPostUrl(post) ?? '#'} scroll={!siteConfig?.fixedHeader}>
          {post?.title}
        </Link>
      </h3>
      <p className="line-clamp-3">{post?.excerpt}</p>
      <div className="space-x-1 text-sm">
        <time dateTime={post?.date ?? undefined}>
          {dayjs(post?.date).format('MMMM D, YYYY')}
        </time>
        <span>— by</span>
        <Link
          href={getAuthorUrl(post) ?? '#'}
          scroll={!siteConfig?.fixedHeader}
          className="hover:underline"
        >
          {post?.author?.full_name ?? post?.author?.username}
        </Link>
      </div>
    </div>
  )
}
