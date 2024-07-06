import * as React from 'react'
import type { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import dayjs from 'dayjs'
import { Tag } from 'emblor'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Forbidden } from '@/components/error'
import { PostProvider } from './post-provider'
import { Analysis } from './analysis'
import { PostViews } from './post-views'
import { FavoriteButton } from './favorite-button'
import { RelatedPosts } from './related-posts'

import { cn, getAuthorUrl, getMeta } from '@/lib/utils'
import { getTranslation, type Translation } from '@/hooks/i18next'
import { getAuth, authenticate } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'
import { getPostAPI, getAdjacentPostAPI } from '@/queries/server/posts'
import { Author, PostMeta } from '@/types/database'

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
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
    title: post?.title,
    description: post?.description,
    keywords: post?.keywords,
    openGraph: {
      type: 'website',
      siteName: process.env.NEXT_PUBLIC_APP_NAME!,
      title: post?.title ?? undefined,
      description: post?.description ?? undefined,
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

  if (
    ['future', 'private'].includes(post?.status) ||
    searchParams?.preview === 'true'
  ) {
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

  const { t } = await getTranslation()

  return (
    <PostProvider value={{ post }}>
      <Analysis />
      <Header />
      <main className="min-h-[80vh] pb-20 sm:pb-40">
        <div className="container min-w-0 flex-1 overflow-auto pt-16">
          <PostTitle title={post?.title} />
          <div className="mb-8 flex justify-between">
            <div className="space-x-1">
              <PostDate date={post?.date} />
              <span>— by</span>
              <PostAuthor author={post?.author} />
            </div>
            <div className="flex space-x-4">
              <PostViews postId={post?.id} />
              <FavoriteButton postId={post?.id} />
            </div>
          </div>
          <PostThumbnail thumbnailUrl={post?.thumbnail_url} />
          <PostContent content={post?.content} />
          <PostTags meta={post?.meta} t={t} />
          <RelatedPosts previousPost={previousPost} nextPost={nextPost} t={t} />
        </div>
      </main>
      <Footer />
    </PostProvider>
  )
}

const PostTitle = ({ title }: { title: string | null }) => {
  if (!title) return null

  return (
    <h1
      className={cn(
        'mb-8 break-all text-center font-serif text-6xl font-bold leading-none tracking-tighter',
        'sm:mb-16 sm:leading-tight md:text-7xl md:leading-none lg:text-8xl'
      )}
    >
      {title}
    </h1>
  )
}

const PostDate = ({ date }: { date: string | null }) => {
  return (
    <time dateTime={date ?? undefined}>
      {dayjs(date).format('MMMM D, YYYY')}
    </time>
  )
}

const PostAuthor = ({ author }: { author: Author | null }) => {
  return (
    <Link
      href={getAuthorUrl(null, { username: author?.username }) ?? '#'}
      className="underline hover:no-underline"
    >
      {author?.full_name}
    </Link>
  )
}

const PostThumbnail = ({ thumbnailUrl }: { thumbnailUrl: string | null }) => {
  if (!thumbnailUrl) return null

  return (
    <div className="mb-8 sm:mx-0 md:mb-16">
      <div
        className="min-h-96 bg-cover bg-center bg-no-repeat sm:mx-0"
        style={{ backgroundImage: `url(${thumbnailUrl})` }}
      ></div>
    </div>
  )
}

const PostContent = ({ content }: { content: string | null }) => {
  if (!content) return null

  return (
    <div className="mb-8" dangerouslySetInnerHTML={{ __html: content }}></div>
  )
}

const PostTags = ({ meta, t }: { meta?: PostMeta[]; t: Translation['t'] }) => {
  const tags: Tag[] = JSON.parse(getMeta(meta, 'tags', '[]'))

  if (Array.isArray(tags) && tags?.length === 0) {
    return null
  }

  return (
    <div className="mb-16">
      <p>{t['tags']}: </p>
      <div>
        {tags?.map((tag: Tag, i: number) => (
          <React.Fragment key={tag.id}>
            {i === 0 ? null : <span>, </span>}
            <span>{tag?.text}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
