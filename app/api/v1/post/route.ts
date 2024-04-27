import { NextResponse, type NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ApiError } from '@/lib/utils'
import { authorize } from '@/hooks/async'

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
    .select('*, profile:profiles(*)')
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

  const { formData, options } = await request.json()
  const { user_id, ...body } = formData
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
    .select('*, profile:profiles(*)')
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  const pathname = options?.revalidatePath

  if (pathname && typeof pathname === 'string') {
    revalidatePath(pathname)
  } else if (pathname && Array.isArray(pathname)) {
    pathname.forEach((pathname: string) => revalidatePath(pathname))
  }

  return pathname
    ? NextResponse.json({ data: result?.data, error: null, revalidated: true })
    : NextResponse.json({ data: result?.data, error: null })
}

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const uid = searchParams.get('uid') as string

  const { formData, options } = await request.json()
  const { user, plan } = await authorize(uid)

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
    .eq('user_id', uid)

  if (total?.error) {
    return NextResponse.json(
      { data: null, error: total?.error },
      { status: 400 }
    )
  }

  const count = total?.count ?? 0

  if (plan === 'free' && count > 2) {
    return NextResponse.json(
      { data: null, error: new ApiError(402) },
      { status: 402 }
    )
  }

  const result = await supabase
    .from('posts')
    .insert({ ...formData, user_id: uid, profile_id: uid })
    .select('*, profile:profiles(*)')
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  const pathname = options?.revalidatePath

  if (pathname && typeof pathname === 'string') {
    revalidatePath(pathname)
  } else if (pathname && Array.isArray(pathname)) {
    pathname.forEach((path: string) => revalidatePath(path))
  }

  return pathname
    ? NextResponse.json({ data: result?.data, error: null, revalidated: true })
    : NextResponse.json({ data: result?.data, error: null })
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string

  const { formData, options } = await request.json()
  const { user_id } = formData
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
    .select('*, profile:profiles(*)')
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  const pathname = options?.revalidatePath

  if (pathname && typeof pathname === 'string') {
    revalidatePath(pathname)
  } else if (pathname && Array.isArray(pathname)) {
    pathname.forEach((path: string) => revalidatePath(path))
  }

  return pathname
    ? NextResponse.json({ data: result?.data, error: null, revalidated: true })
    : NextResponse.json({ data: result?.data, error: null })
}
