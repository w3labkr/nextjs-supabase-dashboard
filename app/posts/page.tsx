import * as React from 'react'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Paging, PagingProvider } from '@/components/paging'
import { LatestPosts } from '@/components/latest-posts'

import { getPostsAPI } from '@/queries/server/posts'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'

// revalidate the data at most every week
// 3600 (hour), 86400 (day), 604800 (week), 2678400 (month), 31536000 (year)
export const revalidate = 0

export default async function PostsPage({
  searchParams,
}: {
  searchParams?: { page?: string; perPage?: string; pageSize?: string }
}) {
  const page = +(searchParams?.page ?? '1')
  const perPage = +(searchParams?.perPage ?? '10')
  const pageSize = +(searchParams?.pageSize ?? '10')

  const { posts, count } = await getPostsAPI(null, {
    page,
    perPage,
    postType: 'post',
    status: 'publish',
  })

  const total = count ?? 0

  return (
    <>
      <Header />
      <main
        className={cn(
          'min-h-[80vh] pb-40',
          siteConfig?.stickyHeader ? 'pt-[61px]' : ''
        )}
      >
        <div className="container flex-1 overflow-auto">
          <h2 className="mt-16 text-center font-serif text-4xl">Posts</h2>
          <PagingProvider value={{ total, page, perPage, pageSize }}>
            <div className="mt-12 space-y-16">
              <LatestPosts
                posts={posts}
                className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
              />
              {Array.isArray(posts) && posts?.length > 0 ? <Paging /> : null}
            </div>
          </PagingProvider>
        </div>
      </main>
      <Footer />
    </>
  )
}
