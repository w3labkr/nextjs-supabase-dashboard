import * as React from 'react'
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import { LucideIcon, LucideIconName } from '@/lib/lucide-icon'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PagingProvider } from '@/components/paging/paging-provider'
import { LatestPosts } from '@/components/latest-posts'
import { Aside } from './aside'

import { getProfileAPI, getPostsAPI } from '@/queries/async'

// revalidate the data at most every hour
export const revalidate = process.env.NODE_ENV === 'production' ? 3600 : 0

export async function generateMetadata(
  {
    params: { username },
  }: {
    params: { username: string }
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { profile } = await getProfileAPI(null, { username })

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
    title: profile?.full_name,
    description: profile?.bio,
    openGraph: {
      title: profile?.full_name ?? undefined,
      description: profile?.bio ?? undefined,
      images: profile?.avatar_url ?? undefined,
    },
  }
}

export default async function ProfilePage({
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
      <main className="min-h-[80vh] pb-40">
        <div className="container flex-1 overflow-auto">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-4 pb-14 pt-11 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-[60px]">
            <div className="relative flex flex-col gap-4">
              <Aside profile={profile} />
            </div>
            <Tabs
              defaultValue="recent"
              className="flex flex-col md:col-span-2 lg:col-span-3"
            >
              <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-end">
                <div className="hidden sm:inline"></div>
                <TabsList className="w-full sm:w-auto">
                  <TabsItem value="recent" iconName="History" />
                  <TabsItem value="favorite" iconName="Heart" />
                </TabsList>
              </div>
              <Separator className="my-4" />
              <TabsContent value="recent">
                <PagingProvider
                  value={{ total: total ?? 0, page, perPage, pageSize, status }}
                >
                  <LatestPosts
                    posts={posts}
                    className="columns-1 gap-8 space-y-8"
                  />
                </PagingProvider>
              </TabsContent>
              <TabsContent value="favorite">
                In non augue ut augue elementum tristique vitae id diam.
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function TabsItem({
  value,
  iconName,
}: {
  value: string
  iconName: LucideIconName
}) {
  return (
    <TabsTrigger value={value} className="w-full text-xs sm:w-auto">
      <LucideIcon name={iconName} className="mr-1 size-3.5 min-w-3.5" />
      <span>{value?.toUpperCase()}</span>
    </TabsTrigger>
  )
}
