import * as React from 'react'
import { notFound } from 'next/navigation'

import { PreviewAlert } from './preview-alert'
import { getUser, getPost, setPostViews } from '@/hooks/async'

export default async function PostPage({
  params: { username, slug },
  searchParams: { preview },
}: {
  params: { username: string; slug: string }
  searchParams: { preview?: string }
}) {
  const { post } = await getPost(null, { username, slug })
  const { user } = await getUser()

  if (!post) notFound()

  if (preview === 'true') {
    if (post?.user_id !== user?.id) notFound()
  } else {
    if (post?.status !== 'publish') notFound()
  }

  if (!preview) setPostViews(post?.id)

  return (
    <main className="min-h-[80vh] pb-40 pt-10">
      {preview && <PreviewAlert />}
      <div className="container flex-1 overflow-auto">
        <h1>{post?.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post?.content ?? '' }}></div>
      </div>
    </main>
  )
}
