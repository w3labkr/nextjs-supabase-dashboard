import * as React from 'react'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PagingProvider } from '@/components/paging/paging-provider'
import { LatestPosts } from '@/components/latest-posts'

import { getPostsAPI } from '@/queries/async'

// revalidate the data at most every hour
export const revalidate = process.env.NODE_ENV === 'production' ? 3600 : 0

export default async function PostsPage({
  searchParams,
}: {
  searchParams?: { page?: string; perPage?: string; pageSize?: string }
}) {
  const page = +(searchParams?.page ?? '1')
  const perPage = +(searchParams?.perPage ?? '50')
  const pageSize = +(searchParams?.pageSize ?? '10')
  const status = 'publish'

  const { posts, count: total } = await getPostsAPI(null, {
    page,
    perPage,
    status,
  })

  return (
    <>
      <Header />
      <main className="min-h-[80vh] pb-40 pt-16">
        <div className="container flex-1 overflow-auto">
          <h2 className="mb-12 text-center font-serif text-4xl">Posts</h2>
          <PagingProvider
            value={{ total: total ?? 0, page, perPage, pageSize, status }}
          >
            {posts ? (
              <LatestPosts
                posts={posts}
                className="columns-1 gap-8 space-y-8"
              />
            ) : null}
          </PagingProvider>
        </div>
      </main>
      <Footer />
    </>
  )
}
