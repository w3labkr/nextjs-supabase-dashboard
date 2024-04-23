'use client'

import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { LucideIcon, LucideIconName } from '@/lib/lucide-icon'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

import { Profile } from '@/types/database'
import { useProfileAPI } from '@/hooks/api'

export default function UserPage({
  params: { username },
}: {
  params: { username: string }
}) {
  const { profile } = useProfileAPI(null, { username })

  return (
    <div>
      <Header />
      <main className="min-h-screen pb-40">
        <div className="container flex-1 overflow-auto">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-4 pb-14 pt-11 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-[60px]">
            <div className="relative flex flex-col gap-4">
              <div className="flex flex-col gap-2.5">
                <Avatar className="size-12 min-w-12">
                  <AvatarImage
                    src={profile?.avatar_url ?? undefined}
                    alt={`@${profile?.username}`}
                  />
                  <AvatarFallback>
                    {profile?.username?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-2">
                  <div>
                    <h1 className="text-4xl font-semibold leading-none tracking-tight">
                      {profile?.full_name}
                    </h1>
                    <p className="whitespace-nowrap text-sm text-gray-600">
                      @{profile?.username}
                    </p>
                  </div>
                  {profile?.bio ? <BioItem profile={profile} /> : null}
                  <ul className="mt-4 space-y-1 whitespace-nowrap text-xs text-gray-600">
                    {profile?.email ? <EmailItem profile={profile} /> : null}
                    {profile?.website ? (
                      <WebsiteItem profile={profile} />
                    ) : null}
                  </ul>
                </div>
              </div>
            </div>
            <Tabs
              defaultValue="recent"
              className="flex flex-col md:col-span-2 lg:col-span-3"
            >
              <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-end">
                <div className="hidden sm:inline"></div>
                <TabsList className="w-full sm:w-auto">
                  <TabsListItem value="recent" iconName="History" />
                  <TabsListItem value="stars" iconName="Star" />
                </TabsList>
              </div>
              <Separator className="my-4" />
              <TabsContent value="recent">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </TabsContent>
              <TabsContent value="stars">
                In non augue ut augue elementum tristique vitae id diam.
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function TabsListItem({
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

function BioItem({ profile }: { profile: Profile }) {
  return (
    <p className="whitespace-nowrap text-sm text-gray-600">{profile?.bio}</p>
  )
}

function EmailItem({ profile }: { profile: Profile }) {
  return (
    <li className="flex">
      <LucideIcon name="Mail" className="mr-2 size-4 min-w-4" />
      {profile?.email}
    </li>
  )
}

function WebsiteItem({ profile }: { profile: Profile }) {
  return (
    <li className="flex">
      <LucideIcon name="Link" className="mr-2 size-4 min-w-4" />
      <Link
        href={profile?.website ?? '#'}
        className={cn('underline-offset-4 hover:underline')}
      >
        {profile?.website}
      </Link>
    </li>
  )
}
