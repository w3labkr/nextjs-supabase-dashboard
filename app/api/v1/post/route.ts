import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, compareTags, getMeta, revalidates } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'
import { pricingPlans } from '@/config/site'
import { PricingPlan } from '@/types/config'
import { PostMeta } from '@/types/database'

import { Tag } from 'emblor'
import { slugify } from '@/lib/slugify'

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
  const { data: post, error } = await supabase
    .from('posts')
    .select('*, author:users(*), meta:postmeta(*)')
    .match(match)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  return NextResponse.json({ data: post, error: null })
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string

  const { data, options } = await request.json()
  const { user_id, meta, ...formData } = data
  const { authorized } = await authorize(user_id)

  if (!authorized) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const { data: old } = await supabase
    .from('posts')
    .select('*, author:users(*), meta:postmeta(*)')
    .eq('id', id)
    .single()

  if (Array.isArray(meta) && meta?.length > 0) {
    // Views updates are done on the client side.
    const denies: string[] = ['views']

    const findNewMeta: PostMeta[] = meta
      ?.filter((r: PostMeta) => !denies.includes(r.meta_key))
      ?.filter((r: PostMeta) => !r.id)

    if (Array.isArray(findNewMeta) && findNewMeta?.length > 0) {
      const { error } = await supabase
        .from('postmeta')
        .insert(findNewMeta)
        .select('*')
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }

    const findExistsMeta: PostMeta[] = meta
      ?.filter((r: PostMeta) => !denies.includes(r.meta_key))
      ?.filter((r: PostMeta) => r.id)
      ?.filter((r: PostMeta) => r.meta_value !== getMeta(old?.meta, r.meta_key))

    if (Array.isArray(findExistsMeta) && findExistsMeta?.length > 0) {
      const { error } = await supabase
        .from('postmeta')
        .upsert(findExistsMeta)
        .select('*')
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }

    const findMetaTags: PostMeta[] = meta
      ?.filter((r: PostMeta) => r.meta_key === 'tags')
      ?.filter((r: PostMeta) => r.meta_value !== getMeta(old?.meta, r.meta_key))

    if (Array.isArray(findMetaTags) && findMetaTags?.length > 0) {
      const oldTags: Tag[] = JSON.parse(getMeta(old?.meta, 'tags', '[]'))
      const newTags: Tag[] = JSON.parse(getMeta(meta, 'tags', '[]'))
      const { added, removed } = compareTags(oldTags, newTags)
      const { error } = await supabase.rpc('set_post_tags', {
        userid: user_id,
        postid: +id,
        added: added?.map((r: Tag) => ({
          name: r.text,
          slug: slugify(r.text),
        })),
        removed: removed?.map((r: Tag) => ({ name: r.text })),
      })
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }
  }

  const { data: post, error } = await supabase
    .from('posts')
    .update(formData)
    .eq('id', id)
    .select('*, author:users(*), meta:postmeta(*)')
    .single()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  return NextResponse.json({
    data: post,
    error: null,
    revalidated: revalidates(options),
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

  const plan = pricingPlans.find((r: PricingPlan) => r.name === user?.plan)

  if (!plan) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 400 }
    )
  }

  const supabase = createClient()
  const counter = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (counter?.error) {
    return NextResponse.json(
      { data: null, error: counter?.error },
      { status: 400 }
    )
  }

  const total = counter?.count ?? 0

  if (plan?.post > -1 && total >= plan?.post) {
    return NextResponse.json(
      { data: null, error: new ApiError(402) },
      { status: 402 }
    )
  }

  const { data: post, error } = await supabase
    .from('posts')
    .insert(formData)
    .select('*, author:users(*), meta:postmeta(*)')
    .single()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  if (Array.isArray(meta) && meta?.length > 0) {
    // Views updates are done on the client side.
    const denies: string[] = ['views']

    const findNewMeta: PostMeta[] = meta
      ?.filter((r: PostMeta) => !denies.includes(r.meta_key))
      ?.filter((r: PostMeta) => !r.id)
      ?.map((r: PostMeta) => ({ ...r, post_id: post?.id }))

    if (Array.isArray(findNewMeta) && findNewMeta?.length > 0) {
      const { error } = await supabase
        .from('postmeta')
        .insert(findNewMeta)
        .select('*')
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }

    const findMetaTags: PostMeta[] = meta?.filter(
      (r: PostMeta) => r.meta_key === 'tags'
    )

    if (Array.isArray(findMetaTags) && findMetaTags?.length > 0) {
      const oldTags: Tag[] = []
      const newTags: Tag[] = JSON.parse(getMeta(meta, 'tags', '[]'))
      const { added, removed } = compareTags(oldTags, newTags)
      const { error } = await supabase.rpc('set_post_tags', {
        userid: userId,
        postid: post?.id,
        added: added?.map((r: Tag) => ({
          name: r.text,
          slug: slugify(r.text),
        })),
        removed: removed?.map((r: Tag) => ({ name: r.text })),
      })
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }
  }

  return NextResponse.json({
    data: post,
    error: null,
    revalidated: revalidates(options),
    now: Date.now(),
  })
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string

  const { data, options } = await request.json()
  const { user_id } = data
  const { authorized } = await authorize(user_id)

  if (!authorized) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const deleted = await supabase.from('posts').delete().eq('id', id)

  if (deleted?.error) {
    return NextResponse.json(
      { data: null, error: deleted?.error },
      { status: 400 }
    )
  }

  return NextResponse.json({
    data: null,
    error: null,
    revalidated: revalidates(options),
    now: Date.now(),
  })
}
