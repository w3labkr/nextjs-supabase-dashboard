import * as React from 'react'
import { notFound } from 'next/navigation'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PagingProvider } from '@/components/paging/paging-provider'
import { LatestPosts } from '@/components/latest-posts'

import { getProfileAPI, getPostsAPI } from '@/queries/async'

export default async function ArchivePage({
  params: { username },
  searchParams,
}: {
  params: { username: string }
  searchParams?: { page?: string; perPage?: string; pageSize?: string }
}) {
  const page = +(searchParams?.page ?? '1')
  const perPage = +(searchParams?.perPage ?? '50')
  const pageSize = +(searchParams?.pageSize ?? '10')
  const status = 'publish'

  const { profile } = await getProfileAPI(null, { username })
  const { posts, count: total } = await getPostsAPI(profile?.id ?? null, {
    page,
    perPage,
    status,
  })

  if (!profile) notFound()

  return (
    <>
      <Header />
      <main className="min-h-[80vh] pb-40 pt-16">
        <div className="container flex-1 overflow-auto">
          <h2 className="mb-12 text-center font-serif text-4xl">Archive</h2>
          <PagingProvider
            value={{ total: total ?? 0, page, perPage, pageSize, status }}
          >
            <LatestPosts
              posts={posts}
              className="columns-1 gap-8 space-y-8 md:columns-2 lg:columns-3"
            />
          </PagingProvider>
        </div>
      </main>
      <Footer />
    </>
  )
}
