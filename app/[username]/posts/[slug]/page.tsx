import * as React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import dayjs from 'dayjs'
import { getAuthorUrl } from '@/lib/utils'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { RelatedPosts } from '@/components/related-posts'

import { PreviewAlert } from './preview-alert'

import { Post } from '@/types/database'
import {
  getUser,
  getPostAPI,
  getAdjacentPostAPI,
  setPostViews,
} from '@/queries/async'

export default async function PostPage({
  params: { username, slug },
  searchParams,
}: {
  params: { username: string; slug: string }
  searchParams?: { preview?: string }
}) {
  const { post } = await getPostAPI(null, {
    username,
    slug: decodeURIComponent(slug),
  })
  const { previousPost, nextPost } = await getAdjacentPostAPI(
    post?.id ?? null,
    { uid: post?.user_id ?? null }
  )

  if (!post) notFound()

  const { user } = await getUser()
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
    </>
  )
}

function PostTitle({ post }: { post: Post }) {
  return (
    <h1 className="mb-16 text-center font-serif text-6xl font-bold leading-tight tracking-tighter md:text-7xl md:leading-none lg:text-8xl">
      {post?.title}
    </h1>
  )
}

function PostMeta({ post }: { post: Post }) {
  const datetime = post?.published_at ?? post?.created_at ?? undefined

  return (
    <div className="mb-8 space-x-1">
      <time dateTime={datetime}>{dayjs(datetime).format('MMMM D, YYYY')}</time>
      <span>— by</span>
      <Link href={getAuthorUrl(post) ?? '#'} className="hover:underline">
        {post?.profile?.full_name}
      </Link>
    </div>
  )
}

function PostThumbnail({ post }: { post: Post }) {
  if (!post?.thumbnail_url) return null

  return (
    <div className="mb-8 sm:mx-0 md:mb-16">
      <div className="sm:mx-0">
        <img src={post?.thumbnail_url} alt="thumbnail" />
      </div>
    </div>
  )
}

function PostContent({ post }: { post: Post }) {
  if (!post?.content) return null

  return (
    <div
      className="mb-16"
      dangerouslySetInnerHTML={{ __html: post?.content }}
    ></div>
  )
}
