import * as React from 'react'
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import dayjs from 'dayjs'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { RelatedPosts } from '@/components/related-posts'
import { Forbidden } from '@/components/error'
import { PostProvider } from './post-provider'
import { Analysis } from './analysis'
import { ViewCount } from './view-count'
import { FavoriteButton } from './favorite-button'

import { getAuthorUrl } from '@/lib/utils'
import { getAuth, authenticate } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'
import { getPostAPI, getAdjacentPostAPI } from '@/queries/server/posts'
import { Post } from '@/types/database'

// revalidate the data at most every month
// 3600 (hour), 86400 (day), 604800 (week), 2678400 (month), 31536000 (year)
// export const revalidate = 2678400

export async function generateMetadata(
  {
    params: { username, slug },
  }: {
    params: { username: string; slug: string }
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { user } = await getUserAPI(null, { username })
  const { post } = await getPostAPI(null, {
    userId: user?.id,
    slug: decodeURIComponent(slug),
  })

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      title: post?.title ?? undefined,
      description: post?.excerpt ?? undefined,
      images: post?.thumbnail_url ?? undefined,
    },
  }
}

export default async function PostPage({
  params: { username, slug },
  searchParams,
}: {
  params: { username: string; slug: string }
  searchParams?: { preview?: string }
}) {
  const { user } = await getUserAPI(null, { username })

  if (!user) notFound()

  const { post } = await getPostAPI(null, {
    userId: user?.id,
    slug: decodeURIComponent(slug),
  })

  if (!post) notFound()

  if (post?.status === 'private' || searchParams?.preview === 'true') {
    const { authenticated } = await authenticate()
    const { session } = await getAuth()
    if (!authenticated) return <Forbidden />
    if (post?.user_id !== session?.user?.id) return <Forbidden />
  } else if (post?.status !== 'publish') {
    notFound()
  }
  const { previousPost, nextPost } = await getAdjacentPostAPI(post?.id, {
    userId: post?.user_id,
    postType: 'post',
    status: 'publish',
  })

  return (
    <PostProvider value={{ post }}>
      <Analysis />
      <Header />
      <main className="min-h-[80vh] pb-40 pt-16">
        <div className="container min-w-0 flex-1 overflow-auto">
          <PostTitle post={post} />
          <PostMeta post={post} />
          <PostThumbnail post={post} />
          <PostContent post={post} />
          <RelatedPosts previousPost={previousPost} nextPost={nextPost} />
        </div>
      </main>
      <Footer />
    </PostProvider>
  )
}

interface FieldProps {
  post: Post
}

const PostTitle = (props: FieldProps) => {
  const { post } = props

  return (
    <h1 className="mb-16 text-center font-serif text-6xl font-bold leading-tight tracking-tighter md:text-7xl md:leading-none lg:text-8xl">
      {post?.title}
    </h1>
  )
}

const PostMeta = (props: FieldProps) => {
  const { post } = props

  return (
    <div className="mb-8 flex justify-between">
      <div className="space-x-1">
        <time dateTime={post?.date ?? undefined}>
          {dayjs(post?.date).format('MMMM D, YYYY')}
        </time>
        <span>— by</span>
        <Link
          href={getAuthorUrl(post?.author?.username) ?? '#'}
          className="hover:underline"
        >
          {post?.author?.full_name}
        </Link>
      </div>
      <div className="flex space-x-4">
        <ViewCount post={post} />
        <FavoriteButton post={post} />
      </div>
    </div>
  )
}

const PostThumbnail = (props: FieldProps) => {
  const { post } = props

  if (!post?.thumbnail_url) return null

  return (
    <div className="mb-8 sm:mx-0 md:mb-16">
      <div
        className="min-h-96 bg-cover bg-center bg-no-repeat sm:mx-0"
        style={{ backgroundImage: `url(${post?.thumbnail_url})` }}
      ></div>
    </div>
  )
}

const PostContent = (props: FieldProps) => {
  const { post } = props

  if (!post?.content) return null

  return (
    <div
      className="mb-16"
      dangerouslySetInnerHTML={{ __html: post?.content }}
    ></div>
  )
}
