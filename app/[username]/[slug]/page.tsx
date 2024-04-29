import * as React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import dayjs from 'dayjs'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PreviewAlert } from './preview-alert'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

import { Post } from '@/types/database'
import { getUser, getPostAPI, setPostViews } from '@/queries/async'

export default async function PostPage({
  params: { username, slug },
  searchParams,
}: {
  params: { username: string; slug: string }
  searchParams?: { preview?: string }
}) {
  const { user } = await getUser()
  const { post } = await getPostAPI(null, { username, slug })

  if (!post) notFound()

  const preview = searchParams?.preview

  if (preview === 'true') {
    if (post?.user_id !== user?.id) notFound()
  } else {
    if (post?.status !== 'publish') notFound()
  }

  if (!preview) setPostViews(post?.id)

  return (
    <>
      {preview && <PreviewAlert />}
      <Header />
      <main className="min-h-[80vh] pb-40 pt-8">
        <div className="container min-w-0 flex-1 overflow-auto">
          <Title post={post} />
          <Author post={post} />
          <Thumbnail post={post} />
          <PublishedAt post={post} />
          <Content post={post} />
        </div>
      </main>
      <Footer />
    </>
  )
}

function Title({ post }: { post: Post }) {
  if (!post?.title) return null

  return (
    <h1 className="mb-12 text-center text-6xl font-bold leading-tight tracking-tighter md:text-left md:text-7xl md:leading-none lg:text-8xl">
      {post?.title}
    </h1>
  )
}

function Author({ post }: { post: Post }) {
  const profile = post?.profile

  return (
    <div className="hidden md:mb-12 md:block">
      <div className="flex items-center">
        <Avatar className="mr-4 size-12 min-w-12">
          <AvatarImage
            src={profile?.avatar_url ?? undefined}
            alt={`@${profile?.username}`}
          />
          <AvatarFallback>{profile?.username?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-xl font-bold">
          <Link
            href={`/${profile?.username}`}
            className="underline-offset-4 hover:underline"
          >
            {profile?.full_name}
          </Link>
        </div>
      </div>
    </div>
  )
}

function Thumbnail({ post }: { post: Post }) {
  if (!post?.thumbnail) return null

  return (
    <div className="mb-8 sm:mx-0 md:mb-16">
      <div className="sm:mx-0">
        <img src={post?.thumbnail} alt="thumbnail" />
      </div>
    </div>
  )
}

function PublishedAt({ post }: { post: Post }) {
  if (!post?.published_at) return null

  return (
    <div className="mb-6 text-lg">
      <time dateTime={post?.published_at ?? undefined}>
        {dayjs(post?.published_at).format('MMMM D, YYYY')}
      </time>
    </div>
  )
}

function Content({ post }: { post: Post }) {
  if (!post?.content) return null

  return <div dangerouslySetInnerHTML={{ __html: post?.content }}></div>
}
