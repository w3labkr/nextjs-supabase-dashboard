import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, getMeta, revalidates } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'
import { TagMeta } from '@/types/database'

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
    .select('*, meta:tagmeta(*)')
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
    .from('tags')
    .select('*, meta:tagmeta(*)')
    .eq('id', id)
    .single()

  if (Array.isArray(meta) && meta?.length > 0) {
    // Views updates are done on the client side.
    const denies: string[] = ['views']

    const findNewMeta: TagMeta[] = meta
      ?.filter((r: TagMeta) => !denies.includes(r.meta_key))
      ?.filter((r: TagMeta) => !r.id)

    if (Array.isArray(findNewMeta) && findNewMeta?.length > 0) {
      const { error } = await supabase
        .from('tagmeta')
        .insert(findNewMeta)
        .select('*')
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }

    const findExistsMeta: TagMeta[] = meta
      ?.filter((r: TagMeta) => !denies.includes(r.meta_key))
      ?.filter((r: TagMeta) => r.id)
      ?.filter((r: TagMeta) => r.meta_value !== getMeta(old?.meta, r.meta_key))

    if (Array.isArray(findExistsMeta) && findExistsMeta?.length > 0) {
      const { error } = await supabase
        .from('tagmeta')
        .upsert(findExistsMeta)
        .select('*')
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }
  } // end of meta

  const { data: tag, error } = await supabase
    .from('tags')
    .update(formData)
    .eq('id', id)
    .select('*, meta:tagmeta(*)')
    .single()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  return NextResponse.json({
    data: tag,
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
  const { data: tag, error } = await supabase
    .from('tags')
    .insert(formData)
    .select('*, meta:tagmeta(*)')
    .single()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  if (Array.isArray(meta) && meta?.length > 0) {
    // Views updates are done on the client side.
    const denies: string[] = ['views']

    const findNewMeta: TagMeta[] = meta
      ?.filter((r: TagMeta) => !denies.includes(r.meta_key))
      ?.filter((r: TagMeta) => !r.id)
      ?.map((r: TagMeta) => ({ ...r, tag_id: tag?.id }))

    if (Array.isArray(findNewMeta) && findNewMeta?.length > 0) {
      const { error } = await supabase
        .from('tagmeta')
        .insert(findNewMeta)
        .select('*')
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }

    const findExistsMeta: TagMeta[] = meta
      ?.filter((r: TagMeta) => !denies.includes(r.meta_key))
      ?.filter((r: TagMeta) => r.id)
      ?.filter((r: TagMeta) => r.meta_value !== getMeta(tag?.meta, r.meta_key))

    if (Array.isArray(findExistsMeta) && findExistsMeta?.length > 0) {
      const { error } = await supabase
        .from('postmeta')
        .upsert(findExistsMeta)
        .select('*')
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
  const { user_id } = data
  const { authorized } = await authorize(user_id)

  if (!authorized) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const { error } = await supabase.from('tags').delete().eq('id', id)

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
