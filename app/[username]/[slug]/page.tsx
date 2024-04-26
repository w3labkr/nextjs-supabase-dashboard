import * as React from 'react'
import { notFound } from 'next/navigation'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PreviewAlert } from './preview-alert'

import { fetcher } from '@/lib/utils'
import { PostAPI } from '@/types/api'
import { getUser, setPostViews } from '@/hooks/async'

export default async function PublicPostPage({
  params: { username, slug },
  searchParams: { preview },
}: {
  params: { username: string; slug: string }
  searchParams: { preview?: string }
}) {
  const fetchUrl = `/api/v1/post?username=${username}&slug=${slug}`
  const { data: post } = await fetcher<PostAPI>(fetchUrl)
  const { user } = await getUser()

  if (!post) notFound()

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
      <main className="min-h-[80vh] pb-40 pt-10">
        <div className="container flex-1 overflow-auto">
          <h1>{post?.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post?.content ?? '' }}></div>
        </div>
      </main>
      <Footer />
    </>
  )
}
