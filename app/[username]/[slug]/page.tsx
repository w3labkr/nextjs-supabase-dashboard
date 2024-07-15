import * as React from 'react'
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Forbidden } from '@/components/error'
import { EntryPublished, EntryAuthor, EntryTags } from '@/components/hentry'

import { PostViews } from './post-views'
import { FavoriteButton } from './favorite-button'
import { RelatedPosts } from './related-posts'
import { Statistics } from './statistics'

import { absoluteUrl, cn } from '@/lib/utils'
import { getTranslation } from '@/hooks/i18next'
import { getAuth, authenticate } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'
import { getPostAPI, getAdjacentPostAPI } from '@/queries/server/posts'

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
  const { id, date, title, content, thumbnail_url, author, meta } = post

  return (
    <>
      <Header />
      <main className="min-h-[80vh] pb-20 sm:pb-40">
        <div className="container min-w-0 flex-1 overflow-auto pt-16">
          <PostTitle text={title} />
          <div className="mb-8 flex justify-between">
            <div className="space-x-1">
              <EntryPublished dateTime={date ?? undefined} />
              <span>— by</span>
              <EntryAuthor
                href={
                  author?.username ? absoluteUrl(`/${author?.username}`) : '#'
                }
                className="underline hover:no-underline"
                author={author}
              />
            </div>
            <div className="flex space-x-4">
              <PostViews meta={post?.meta} />
              <FavoriteButton id={id} />
            </div>
          </div>
          <PostThumbnail
            className="mb-8 sm:mx-0 md:mb-16"
            backgroundImage={
              thumbnail_url ? `url(${thumbnail_url})` : undefined
            }
          />
          <PostContent className="mb-8" __html={content} />
          <div className="mb-16">
            <EntryTags pathname={`/${username}`} meta={meta} />
          </div>
          <RelatedPosts previousPost={previousPost} nextPost={nextPost} t={t} />
        </div>
      </main>
      <Footer />
      <Statistics post={post} />
    </>
  )
}

interface PostTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text: string | null
}

const PostTitle = ({ className, text, ...props }: PostTitleProps) => {
  return (
    <h1
      className={cn(
        'mb-8 break-all text-center font-serif text-6xl font-bold leading-none tracking-tighter',
        'sm:mb-16 sm:leading-tight md:text-7xl md:leading-none lg:text-8xl',
        className
      )}
      {...props}
    >
      {text}
    </h1>
  )
}

interface PostThumbnailProps extends React.HTMLAttributes<HTMLDivElement> {
  backgroundImage?: string
}

const PostThumbnail = ({ backgroundImage, ...props }: PostThumbnailProps) => {
  if (!backgroundImage) return null

  return (
    <div {...props}>
      <div
        className="min-h-96 bg-cover bg-center bg-no-repeat sm:mx-0"
        style={{ backgroundImage }}
      ></div>
    </div>
  )
}

interface PostContentProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'dangerouslySetInnerHTML'
  > {
  __html: string | null
}

const PostContent = ({ __html, ...props }: PostContentProps) => {
  if (!__html) return null

  return <div dangerouslySetInnerHTML={{ __html }} {...props}></div>
}
