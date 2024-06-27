import { NextResponse, type NextRequest } from 'next/server'
import { createClient, createAdminClient } from '@/supabase/server'
import { ApiError, getMeta, revalidates } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'
import { UserMeta } from '@/types/database'

import dayjs from 'dayjs'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string
  const username = searchParams.get('username') as string

  let match: Record<string, any> = {}

  if (id) match = { ...match, id }
  if (username) match = { ...match, username }

  const supabase = createClient()
  const { data: user, error } = await supabase
    .from('users')
    .select('*, meta:usermeta(*)')
    .match(match)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  if (!user) {
    return NextResponse.json({ data: null, error: null })
  }

  return NextResponse.json({ data: user, error: null })
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string

  const { data, options } = await request.json()
  const { meta, ...formData } = data
  const { authorized } = await authorize(id)
  const { user } = await getUserAPI(id)

  if (!authorized || !user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  if (formData?.username && user?.username_changed_at) {
    const now = dayjs()
    const startDate = dayjs(user?.username_changed_at)
    const endDate = startDate.add(1, 'month')
    if (now < endDate) {
      const diff = endDate.diff(now, 'days')
      const error = `You can change it after ${diff} days.`
      return NextResponse.json(
        { data: null, error: new ApiError(403, error) },
        { status: 403 }
      )
    }
  }

  const supabase = createClient()
  const { data: old } = await supabase
    .from('users')
    .select('*, meta:usermeta(*)')
    .eq('id', id)
    .single()

  if (Array.isArray(meta) && meta?.length > 0) {
    const denies: string[] = []
    const findNewMeta: UserMeta[] = meta
      ?.filter((r: UserMeta) => !denies.includes(r.meta_key))
      ?.filter((r: UserMeta) => !r.id)

    if (findNewMeta) {
      const { error } = await supabase
        .from('usermeta')
        .insert(findNewMeta)
        .select('*')
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }

    const findExistsMeta: UserMeta[] = meta
      ?.filter((r: UserMeta) => !denies.includes(r.meta_key))
      ?.filter((r: UserMeta) => r.id)
      ?.filter((r: UserMeta) => r.meta_value !== getMeta(old?.meta, r.meta_key))

    if (findExistsMeta) {
      const { error } = await supabase
        .from('usermeta')
        .upsert(findExistsMeta)
        .select('*')
      if (error) {
        return NextResponse.json({ data: null, error }, { status: 400 })
      }
    }
  }

  const { data: newUser, error } = await supabase
    .from('users')
    .update(formData)
    .eq('id', id)
    .select('*, meta:usermeta(*)')
    .single()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  return NextResponse.json({
    data: newUser,
    error: null,
    revalidated: revalidates(options),
    now: Date.now(),
  })
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string

  const { options } = await request.json()
  const { authorized } = await authorize(id)

  if (!authorized) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const bucketId = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!
  const { data: list } = await supabase.storage.from(bucketId).list(id)

  if (Array.isArray(list) && list?.length > 0) {
    const files = list.map((file) => `${id}/${file?.name}`)
    const removed = await supabase.storage.from(bucketId).remove(files)
    if (removed?.error) {
      return NextResponse.json(
        { data: null, error: removed?.error },
        { status: 400 }
      )
    }
  }

  const supabaseAdmin = createAdminClient()
  const account = await supabaseAdmin.deleteUser(id)

  if (account?.error) {
    return NextResponse.json(
      { data: null, error: account?.error },
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
