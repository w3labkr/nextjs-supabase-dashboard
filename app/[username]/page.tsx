import * as React from 'react'
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchForm } from '@/components/search-form'

import { Aside } from './aside'
import { PostList } from './post-list'
import { RecentLink, FavoritesLink } from './tab-links'

import { cn } from '@/lib/utils'
import { getUserAPI } from '@/queries/server/users'

// revalidate the data at most every week
// 3600 (hour), 86400 (day), 604800 (week), 2678400 (month), 31536000 (year)
export const revalidate = 0

export async function generateMetadata(
  {
    params: { username },
  }: {
    params: { username: string }
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { user } = await getUserAPI(null, { username })

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
    title: user?.full_name,
    description: user?.bio,
    openGraph: {
      title: user?.full_name ?? undefined,
      description: user?.bio ?? undefined,
      images: user?.avatar_url ?? undefined,
    },
  }
}

export default async function UserPage({
  params: { username },
  searchParams,
}: {
  params: { username: string }
  searchParams?: { q?: string }
}) {
  const { user } = await getUserAPI(null, { username })

  if (!user) notFound()

  return (
    <>
      <Header />
      <main className={cn('min-h-[80vh] pb-40')}>
        <div className="container flex-1 overflow-auto pt-12">
          <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-[60px]">
            <Aside className="space-y-2" user={user} />
            <div className="flex flex-col space-y-4 md:col-span-2 lg:col-span-3">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <RecentLink user={user} />
                  <FavoritesLink user={user} />
                </div>
                <SearchForm
                  placeholder="find_a_post"
                  translate="yes"
                  values={{ q: searchParams?.q ?? '' }}
                />
              </div>
              <PostList className="space-y-16 border-t" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
