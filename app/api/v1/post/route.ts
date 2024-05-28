import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidatePaths, setMeta } from '@/lib/utils'
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
    .select('*, user:users!inner(*), meta:post_metas(*)')
    .match(match)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  const output = post ? setMeta(post) : post

  return NextResponse.json({ data: output, error: null })
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string

  const { data, options } = await request.json()
  const { user_id, ...formData } = data
  const { authorized } = await authorize(user_id)

  if (!authorized) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const { data: post, error } = await supabase
    .from('posts')
    .update(formData)
    .match({ id, user_id })
    .select('*, user:users(*), meta:post_metas(*)')
    .single()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  const output = post ? setMeta(post) : post
  const revalidated = revalidatePaths(options?.revalidatePaths)

  return NextResponse.json({
    data: output,
    error: null,
    revalidated,
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

  const supabase = createClient()
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

  const totalCount = total?.count ?? 0

  if (user?.plan === 'free' && totalCount > 2) {
    return NextResponse.json(
      { data: null, error: new ApiError(402) },
      { status: 402 }
    )
  }

  const { data: post, error } = await supabase
    .from('posts')
    .insert({ ...data, user_id: userId })
    .select('*, user:users(*), meta:post_metas(*)')
    .single()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  const output = post ? setMeta(post) : post
  const revalidated = revalidatePaths(options?.revalidatePaths)

  return NextResponse.json({
    data: output,
    error: null,
    revalidated,
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

  const revalidated = revalidatePaths(options?.revalidatePaths)

  return NextResponse.json({
    data: null,
    error: null,
    revalidated,
    now: Date.now(),
  })
}
