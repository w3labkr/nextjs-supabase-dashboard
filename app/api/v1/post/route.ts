import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ApiError, revalidatePaths } from '@/lib/utils'
import { authorize } from '@/queries/async'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const id = searchParams.get('id') as string
  const uid = searchParams.get('uid') as string
  const slug = searchParams.get('slug') as string
  const status = searchParams.get('status') as string
  const postType = (searchParams.get('postType') as string) ?? 'post'

  let match = {}

  if (id) match = { ...match, id }
  if (uid) match = { ...match, user_id: uid }
  if (postType) match = { ...match, type: postType }
  if (status) match = { ...match, status }
  if (slug) match = { ...match, slug }

  const supabase = createClient()
  const result = await supabase
    .from('posts')
    .select('*, creator:profiles(*), views:post_views(*)')
    .match(match)
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
    .select('*, creator:profiles(*), views:post_views(*)')
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  const revalidated = revalidatePaths(options?.revalidatePaths)

  return NextResponse.json({
    data: result?.data,
    error: null,
    revalidated,
    now: Date.now(),
  })
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

  const inserted = await supabase
    .from('posts')
    .insert({ ...formData, user_id: uid })
    .select('*, creator:profiles(*)')
    .single()

  if (inserted?.error) {
    return NextResponse.json(
      { data: null, error: inserted?.error },
      { status: 400 }
    )
  }

  const views = await supabase
    .from('post_views')
    .insert({ id: inserted?.data?.id })
    .select('*')
    .single()

  if (views?.error) {
    return NextResponse.json(
      { data: null, error: views?.error },
      { status: 400 }
    )
  }

  const data = { ...inserted?.data, views: views?.data }
  const revalidated = revalidatePaths(options?.revalidatePaths)

  return NextResponse.json({
    data,
    error: null,
    revalidated,
    now: Date.now(),
  })
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
  const deleted = await supabase.from('posts').delete().match({ id, user_id })

  if (deleted?.error) {
    return NextResponse.json(
      { data: null, error: deleted?.error },
      { status: 400 }
    )
  }

  const views = await supabase.from('post_views').delete().match({ id })

  if (views?.error) {
    return NextResponse.json(
      { data: null, error: views?.error },
      { status: 400 }
    )
  }

  const revalidated = revalidatePaths(options?.revalidatePaths)

  return NextResponse.json({
    data: null,
    error: null,
    revalidated,
    now: Date.now(),
  })
}
