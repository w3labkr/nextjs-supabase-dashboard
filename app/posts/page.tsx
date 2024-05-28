import * as React from 'react'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PagingProvider } from '@/components/paging/paging-provider'
import { LatestPosts } from '@/components/latest-posts'

import { getPostsAPI } from '@/queries/server/posts'

// revalidate the data at most every week
// 3600 (hour), 86400 (day), 604800 (week), 2678400 (month), 31536000 (year)
// export const revalidate = 604800

export default async function PostsPage({
  searchParams,
}: {
  searchParams?: { page?: string; perPage?: string; pageSize?: string }
}) {
  const page = +(searchParams?.page ?? '1')
  const perPage = +(searchParams?.perPage ?? '50')
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
      <main className="min-h-[80vh] pb-40 pt-16">
        <div className="container flex-1 overflow-auto">
          <h2 className="mb-12 text-center font-serif text-4xl">Posts</h2>
          <PagingProvider value={{ total, page, perPage, pageSize }}>
            <LatestPosts posts={posts} className="columns-1 gap-8 space-y-8" />
          </PagingProvider>
        </div>
      </main>
      <Footer />
    </>
  )
}
