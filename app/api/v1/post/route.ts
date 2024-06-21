import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidates } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'
import { pricingPlans } from '@/config/site'
import { PricingPlan } from '@/types/config'
import { Post } from '@/types/database'

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

  if (Array.isArray(meta) && meta?.length > 0) {
    const denies: string[] = ['views']
    const data1 = meta
      ?.filter((r: Record<string, any>) => !denies.includes(r.meta_key))
      ?.filter((r: Record<string, any>) => !r.id)

    if (data1) {
      const insersted = await supabase.from('postmeta').insert(data1).select()
      if (insersted?.error) {
        return NextResponse.json(
          { data: null, error: insersted?.error },
          { status: 400 }
        )
      }
    }

    const data2 = meta
      ?.filter((r: Record<string, any>) => !denies.includes(r.meta_key))
      ?.filter((r: Record<string, any>) => r.id)

    if (data2) {
      const upserted = await supabase.from('postmeta').upsert(data2).select()
      if (upserted?.error) {
        return NextResponse.json(
          { data: null, error: upserted?.error },
          { status: 400 }
        )
      }
    }
  }

  const { data: post, error } = await supabase
    .from('posts')
    .update(formData)
    .match({ id, user_id })
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

  if (Array.isArray(data) && data?.length > 0) {
    let endIndex = data?.length - (total + data?.length - plan?.post)
    if (endIndex < 0) endIndex = 0

    const { data: list, error } = await supabase
      .from('posts')
      .insert(plan?.post > -1 ? data.slice(0, endIndex) : data)
      .select('*, author:users(*), meta:postmeta(*)')

    if (error) {
      return NextResponse.json(
        { data: null, count: null, error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      data: list,
      count: list?.length,
      error: null,
      revalidated: revalidates(options),
      now: Date.now(),
    })
  }

  const { data: post, error } = await supabase
    .from('posts')
    .insert(data)
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
  const deleted = await supabase.from('posts').delete().match({ id, user_id })

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
