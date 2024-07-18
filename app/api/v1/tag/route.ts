import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import {
  ApiError,
  getMeta,
  getMetaValue,
  relativeUrl,
  revalidates,
  compareMetaValue,
  setMeta,
} from '@/lib/utils'
import { authorize } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'
import { PostMeta, PostTag, TagMeta } from '@/types/database'
import { Tag } from '@/lib/emblor'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string
  const userId = searchParams.get('userId') as string
  const slug = searchParams.get('slug') as string

  let match: Record<string, any> = {}

  if (id) match = { ...match, id }
  if (userId) match = { ...match, user_id: userId }
  if (slug) match = { ...match, slug }

  const supabase = createClient()
  const { data: tag, error } = await supabase
    .from('tags')
    .select('*, meta:tagmeta(*), post_tags(*)')
    .match(match)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  return NextResponse.json({ data: tag, error: null })
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string

  const { data, options } = await request.json()
  const { user_id, meta, post_tags, ...formData } = data
  const { authorized } = await authorize(user_id)

  if (!authorized) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const { data: old } = await supabase
    .from('tags')
    .select('*, meta:tagmeta(*), post_tags(*)')
    .eq('id', id)
    .single()

  if (Array.isArray(meta) && meta?.length > 0) {
    // Views updates are done on the client side.
    const denies: string[] = ['views']

    const newMetas: TagMeta[] = meta
      ?.filter((r: TagMeta) => !denies.includes(r.meta_key))
      ?.filter((r: TagMeta) => !r.id)

    if (Array.isArray(newMetas) && newMetas?.length > 0) {
      const { error } = await supabase.from('tagmeta').insert(newMetas)
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }

    const metas: TagMeta[] = meta
      ?.filter((r: TagMeta) => !denies.includes(r.meta_key))
      ?.filter((r: TagMeta) => r.id)
      ?.filter((r: TagMeta) => !compareMetaValue(old?.meta, r, r.meta_key))

    if (Array.isArray(metas) && metas?.length > 0) {
      const { error } = await supabase.from('tagmeta').upsert(metas)
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }
  } // end of meta

  let revalidatePaths: string[] = []

  if (Array.isArray(post_tags) && post_tags?.length > 0) {
    const ids = post_tags.map((r: PostTag) => r.post_id)
    const { data: posts } = await supabase
      .from('posts')
      .select('*, author:users(*), meta:postmeta(*)')
      .in('id', ids)

    let postmetas: PostMeta[] = []

    if (Array.isArray(posts) && posts?.length > 0) {
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i]

        if (post?.permalink) {
          revalidatePaths = [...revalidatePaths, relativeUrl(post?.permalink)]
        }

        const meta = getMeta(post?.meta, 'tags')
        const oldValue: Tag[] = JSON.parse(meta?.meta_value ?? '[]')
        const newValue: Tag[] = oldValue.map((r: Tag) => {
          if (r?.slug === old?.slug) {
            r.text = formData?.name
            r.slug = formData?.slug
          }
          return r
        })
        const newMeta = setMeta(post?.meta, 'tags', JSON.stringify(newValue))

        postmetas = [...postmetas, ...newMeta]
      }
    }

    if (Array.isArray(postmetas) && postmetas?.length > 0) {
      const { error } = await supabase
        .from('postmeta')
        .upsert(postmetas)
        .select('*')
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }
  } // end of postmeta

  const { data: tag, error } = await supabase
    .from('tags')
    .update(formData)
    .eq('id', id)
    .select('*, meta:tagmeta(*), post_tags(*)')
    .single()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  return NextResponse.json({
    data: tag,
    error: null,
    revalidated: revalidates({ ...options, revalidatePaths }),
    now: Date.now(),
  })
}

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') as string

  const { data, options } = await request.json()
  const { meta, ...formData } = data
  const { authorized } = await authorize(userId)
  const { user } = await getUserAPI(userId)

  if (!authorized || !user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const { data: tag, error } = await supabase
    .from('tags')
    .insert(formData)
    .select('*, meta:tagmeta(*), post_tags(*)')
    .single()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  if (Array.isArray(meta) && meta?.length > 0) {
    // Views updates are done on the client side.
    const denies: string[] = ['views']

    const newMetas: TagMeta[] = meta
      ?.filter((r: TagMeta) => !denies.includes(r.meta_key))
      ?.filter((r: TagMeta) => !r.id)
      ?.map((r: TagMeta) => ({ ...r, tag_id: tag?.id }))

    if (Array.isArray(newMetas) && newMetas?.length > 0) {
      const { error } = await supabase.from('tagmeta').insert(newMetas)
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }

    const metas: TagMeta[] = meta
      ?.filter((r: TagMeta) => !denies.includes(r.meta_key))
      ?.filter((r: TagMeta) => r.id)
      ?.filter((r: TagMeta) => !compareMetaValue(tag?.meta, r, r.meta_key))

    if (Array.isArray(metas) && metas?.length > 0) {
      const { error } = await supabase.from('tagmeta').upsert(metas)
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }
  } // end of meta

  return NextResponse.json({
    data: tag,
    error: null,
    revalidated: revalidates(options),
    now: Date.now(),
  })
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string

  const { data, options } = await request.json()
  const { user_id, post_tags, ...formData } = data
  const { authorized } = await authorize(user_id)

  if (!authorized) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()

  let revalidatePaths: string[] = []

  if (Array.isArray(post_tags) && post_tags?.length > 0) {
    const ids = post_tags.map((r: PostTag) => r.post_id)
    const { data: posts } = await supabase
      .from('posts')
      .select('*, author:users(*), meta:postmeta(*)')
      .in('id', ids)

    let postmetas: PostMeta[] = []

    if (Array.isArray(posts) && posts?.length > 0) {
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i]

        if (post?.permalink) {
          revalidatePaths = [...revalidatePaths, relativeUrl(post?.permalink)]
        }

        const meta = getMeta(post?.meta, 'tags')
        const oldValue: Tag[] = JSON.parse(meta?.meta_value ?? '[]')
        const newValue = oldValue.filter((r: Tag) => r.slug !== formData?.slug)
        const newMeta = setMeta(post?.meta, 'tags', JSON.stringify(newValue))

        postmetas = [...postmetas, ...newMeta]
      }
    }

    if (Array.isArray(postmetas) && postmetas?.length > 0) {
      const { error } = await supabase
        .from('postmeta')
        .upsert(postmetas)
        .select('*')
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }
  } // end of postmeta

  const { error } = await supabase.from('tags').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  return NextResponse.json({
    data: null,
    error: null,
    revalidated: revalidates({ ...options, revalidatePaths }),
    now: Date.now(),
  })
}
