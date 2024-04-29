import * as React from 'react'
import { notFound } from 'next/navigation'

import { LucideIcon, LucideIconName } from '@/lib/lucide-icon'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PagingProvider } from '@/components/paging/paging-provider'
import { Aside } from './aside'
import { LatestPosts } from './latest-posts'

import { getProfileAPI, getPostsAPI } from '@/queries/async'

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
      <main className="min-h-screen pb-40">
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
                  <TabsItem value="stars" iconName="Star" />
                </TabsList>
              </div>
              <Separator className="my-4" />
              <TabsContent value="recent">
                <PagingProvider
                  value={{ total: total ?? 0, page, perPage, pageSize, status }}
                >
                  <LatestPosts posts={posts} />
                </PagingProvider>
              </TabsContent>
              <TabsContent value="stars">
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
