import * as React from 'react'
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchForm } from '@/components/search-form'

import { TabLink } from '../components/tab-link'
import { Aside } from '../aside'
import { PostList } from './post-list'

import { absoluteUrl } from '@/lib/utils'
import { getTranslation } from '@/hooks/i18next'
import { getPathname } from '@/hooks/headers'
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
    title: `${username} Favorites`,
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
  searchParams?: { q?: string }
}) {
  const { user } = await getUserAPI(null, { username })

  if (!user) notFound()

  const { t } = await getTranslation()
  const pathname = await getPathname()

  return (
    <>
      <Header />
      <main className="min-h-[80vh] pb-20 sm:pb-40">
        <div className="container flex-1 overflow-auto pt-12">
          <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-5">
            <Aside className="space-y-2" user={user} />
            <div className="flex flex-col space-y-4 md:col-span-3 lg:col-span-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <TabLink
                    t={t}
                    translate="yes"
                    iconName="History"
                    href={absoluteUrl(`/${username}`)}
                    active={false}
                  >
                    posts
                  </TabLink>
                  <TabLink
                    t={t}
                    translate="yes"
                    iconName="Heart"
                    iconClassName="fill-destructive text-destructive dark:fill-white dark:text-white"
                    href={absoluteUrl(`/${username}/favorites`)}
                    active={true}
                  >
                    favorites
                  </TabLink>
                </div>
                <SearchForm
                  path={pathname}
                  placeholder="find_favorites"
                  translate="yes"
                  values={{ q: searchParams?.q ?? '' }}
                />
              </div>
              <PostList user={user} className="space-y-16 border-t" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
