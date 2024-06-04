import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidates } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string
  const userId = searchParams.get('userId') as string
  const slug = searchParams.get('slug') as string

  let match = {}

  if (id) match = { ...match, id }
  if (userId) match = { ...match, user_id: userId }
  if (slug) match = { ...match, slug }

  const supabase = createClient()
  const { data: post, error } = await supabase
    .from('posts')
    .select('*, author:users(*), meta:post_metas(*)')
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

  if (Array.isArray(meta) && meta?.length > 0) {
    const denyMetaKeys: string[] = ['view_count']
    const addMeta = meta
      ?.filter((r: Record<string, any>) => !denyMetaKeys.includes(r.meta_key))
      ?.filter((r: Record<string, any>) => !r.id)

    if (addMeta) {
      const { error } = await supabase
        .from('post_metas')
        .insert(addMeta)
        .select()
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }

    const editMeta = meta
      ?.filter((r: Record<string, any>) => !denyMetaKeys.includes(r.meta_key))
      ?.filter((r: Record<string, any>) => r.id)

    if (editMeta) {
      const { error } = await supabase
        .from('post_metas')
        .upsert(editMeta)
        .select()
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }
  }

  const { data: post, error } = await supabase
    .from('posts')
    .update(formData)
    .match({ id, user_id })
    .select('*, author:users(*), meta:post_metas(*)')
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
  const { authorized } = await authorize(userId)
  const { user } = await getUserAPI(userId)

  if (!authorized || !user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const pricingPlan = [
    { name: 'free', post: 3 },
    { name: 'basic', post: -1 },
    { name: 'standard', post: -1 },
    { name: 'premium', post: -1 },
  ]
  const plan = pricingPlan.find((r) => r.name === user?.plan)

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
  const overflows = data?.length - total

  if (plan?.post > 0 && total >= plan?.post) {
    return NextResponse.json(
      { data: null, error: new ApiError(402) },
      { status: 402 }
    )
  }

  if (Array.isArray(data) && data?.length > 0 && overflows > 0) {
    const {
      data: list,
      count: listCount,
      error,
    } = await supabase
      .from('posts')
      .insert(data.slice(0, overflows))
      .select('*, author:users(*), meta:post_metas(*)')

    if (error) {
      return NextResponse.json(
        { data: null, count: null, error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      data: list,
      count: listCount ?? 0,
      error: null,
      revalidated: revalidates(options),
      now: Date.now(),
    })
  }

  const { data: post, error } = await supabase
    .from('posts')
    .insert(data)
    .select('*, author:users(*), meta:post_metas(*)')
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
  const { error } = await supabase.from('posts').delete().match({ id, user_id })

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
