import * as React from 'react'
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import { cn, getUserUrl } from '@/lib/utils'
import { LucideIcon } from '@/lib/lucide-icon'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PagingProvider } from '@/components/paging/paging-provider'
import { LatestPosts } from '@/components/latest-posts'
import { Aside } from '../aside'

import { getUserAPI } from '@/queries/server/users'
import { getFavoritePostsAPI } from '@/queries/server/posts'

// revalidate the data at most every week
// 3600 (hour), 86400 (day), 604800 (week), 2678400 (month), 31536000 (year)
export const revalidate = 604800

export async function generateMetadata(
  {
    params: { username },
  }: {
    params: { username: string }
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { user } = await getUserAPI(null, { username })

  if (!user) return {}

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
    title: user?.full_name,
    description: user?.bio,
    openGraph: {
      title: user?.full_name ?? undefined,
      description: user?.bio ?? undefined,
      images: user?.avatar_url ?? undefined,
    },
  }
}

export default async function FavoritesPage({
  params: { username },
  searchParams,
}: {
  params: { username: string }
  searchParams?: { page?: string; perPage?: string; pageSize?: string }
}) {
  const { user } = await getUserAPI(null, { username })

  if (!user) notFound()

  const page = +(searchParams?.page ?? '1')
  const perPage = +(searchParams?.perPage ?? '50')
  const pageSize = +(searchParams?.pageSize ?? '10')

  const { posts, count } = await getFavoritePostsAPI(user?.id ?? null, {
    page,
    perPage,
    status: 'publish',
  })

  const total = count ?? 0

  return (
    <>
      <Header />
      <main className="min-h-[80vh] pb-40">
        <div className="container flex-1 overflow-auto">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-4 pb-14 pt-11 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-[60px]">
            <div className="relative flex flex-col gap-4">
              <Aside user={user} />
            </div>
            <div className="flex flex-col md:col-span-2 lg:col-span-3">
              <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-end">
                <div className="hidden sm:inline">Favorited generations</div>
                <div className="flex w-full gap-2 sm:w-auto">
                  <Link
                    href={getUserUrl(username) ?? '#'}
                    className={cn(
                      'flex w-full items-center sm:w-auto',
                      'text-muted-foreground'
                    )}
                  >
                    <LucideIcon
                      name="History"
                      className="mr-1 size-4 min-w-4"
                    />
                    Recent
                  </Link>
                  <Link
                    href="#"
                    className={cn('flex w-full items-center sm:w-auto')}
                  >
                    <LucideIcon name="Heart" className="mr-1 size-4 min-w-4" />
                    Favorites
                  </Link>
                </div>
              </div>
              <Separator className="my-4" />
              <PagingProvider value={{ total, page, perPage, pageSize }}>
                <LatestPosts
                  posts={posts}
                  className="columns-1 gap-8 space-y-8"
                />
              </PagingProvider>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
