import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import {
  ApiError,
  getMetaValue,
  revalidates,
  compareMetaValue,
} from '@/lib/utils'
import { authorize } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'
import { pricingPlans, type PricingPlan } from '@/config/site'
import { type PostMeta } from '@/types/database'

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

    const newMetas: PostMeta[] = meta
      ?.filter((r: PostMeta) => !denies.includes(r.meta_key))
      ?.filter((r: PostMeta) => !r.id)

    if (Array.isArray(newMetas) && newMetas?.length > 0) {
      const { error } = await supabase.from('postmeta').insert(newMetas)
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }

    const metas: PostMeta[] = meta
      ?.filter((r: PostMeta) => !denies.includes(r.meta_key))
      ?.filter((r: PostMeta) => r.id)
      ?.filter((r: PostMeta) => !compareMetaValue(old?.meta, r, r.meta_key))

    if (Array.isArray(metas) && metas?.length > 0) {
      const { error } = await supabase.from('postmeta').upsert(metas)
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }

    const metaTags: PostMeta[] = meta
      ?.filter((r: PostMeta) => r.meta_key === 'tags')
      ?.filter(
        (r: PostMeta) => r.meta_value !== getMetaValue(old?.meta, r.meta_key)
      )

    if (Array.isArray(metaTags) && metaTags?.length > 0) {
      const { error } = await supabase.rpc('set_post_tags', {
        userid: user_id,
        postid: +id,
      })
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }
  } // end of meta

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

  const supabase = createClient()
  const plan = pricingPlans.find((r: PricingPlan) => r.name === user?.plan)

  if (!plan) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 400 }
    )
  }

  const total = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (total?.error) {
    return NextResponse.json(
      { data: null, error: total?.error },
      { status: 400 }
    )
  }

  const count = total?.count ?? 0

  if (plan?.post > -1 && count >= plan?.post) {
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

    const newMetas: PostMeta[] = meta
      ?.filter((r: PostMeta) => !denies.includes(r.meta_key))
      ?.filter((r: PostMeta) => !r.id)
      ?.map((r: PostMeta) => ({ ...r, post_id: post?.id }))

    if (Array.isArray(newMetas) && newMetas?.length > 0) {
      const { error } = await supabase.from('postmeta').insert(newMetas)
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }

    const metas: PostMeta[] = meta
      ?.filter((r: PostMeta) => !denies.includes(r.meta_key))
      ?.filter((r: PostMeta) => r.id)
      ?.filter((r: PostMeta) => !compareMetaValue(post?.meta, r, r.meta_key))

    if (Array.isArray(metas) && metas?.length > 0) {
      const { error } = await supabase.from('postmeta').upsert(metas)
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }

    const metaTags: PostMeta[] = meta
      ?.filter((r: PostMeta) => r.meta_key === 'tags')
      ?.filter(
        (r: PostMeta) => r.meta_value !== getMetaValue(post?.meta, r.meta_key)
      )

    if (Array.isArray(metaTags) && metaTags?.length > 0) {
      const { error } = await supabase.rpc('set_post_tags', {
        userid: userId,
        postid: post?.id,
      })
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }
  } // end of meta

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
  const { error } = await supabase.from('posts').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  return NextResponse.json({
    data: null,
    error: null,
    revalidated: revalidates(options),
    now: Date.now(),
  })
}
