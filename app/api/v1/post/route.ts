import { NextResponse, type NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ApiError } from '@/lib/utils'
import { authorize } from '@/hooks/async/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const id = searchParams.get('id') as string
  const username = searchParams.get('username') as string
  const slug = searchParams.get('slug') as string
  const status = searchParams.get('status') as string

  let match = {}

  if (id) match = { ...match, id }
  if (username) match = { ...match, 'profile.username': username }
  if (slug) match = { ...match, slug }
  if (status) match = { ...match, status }

  const supabase = createClient()
  const result = await supabase
    .from('posts')
    .select('*, user:users(*), profile:profiles(*)')
    .match(match)
    .limit(1)
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  return NextResponse.json({ data: result?.data, error: null })
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string

  const { user_id, ...body } = await request.json()
  const { user } = await authorize(user_id)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const result = await supabase
    .from('posts')
    .update(body)
    .match({ id, user_id })
    .select('*, user:users(*), profile:profiles(*)')
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  const slug = result?.data?.slug
  const username = result?.data?.profile?.username

  revalidatePath(`/${username}/${slug}`)

  return NextResponse.json({ data: result?.data, error: null })
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string

  const { user_id } = await request.json()
  const { user } = await authorize(user_id)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const result = await supabase
    .from('posts')
    .delete()
    .match({ id, user_id })
    .select('*, user:users(*), profile:profiles(*)')
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  const slug = result?.data?.slug
  const username = result?.data?.profile?.username

  revalidatePath(`/${username}/${slug}`)

  return NextResponse.json({ data: result?.data, error: null })
}

export async function PUT(request: NextRequest) {
  const { user_id, ...body } = await request.json()
  const { user, plan } = await authorize(user_id)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const total = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user_id)

  if (total?.error) {
    return NextResponse.json(
      { data: null, error: total?.error },
      { status: 400 }
    )
  }

  const count = total?.count ?? 0

  if (plan?.isFree && count > 2) {
    return NextResponse.json(
      { data: null, error: new ApiError(402) },
      { status: 402 }
    )
  }

  const result = await supabase
    .from('posts')
    .insert({ ...body, user_id, profile_id: user_id })
    .select('*, user:users(*), profile:profiles(*)')
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  return NextResponse.json({ data: result?.data, error: null })
}
