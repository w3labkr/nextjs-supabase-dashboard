import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidatePaths } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'

import dayjs from 'dayjs'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string
  const username = searchParams.get('username') as string

  let match = {}

  if (id) match = { ...match, id }
  if (username) match = { ...match, username }

  const supabase = createClient()
  const result = await supabase
    .from('profiles')
    .select('*')
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

  const { user } = await authorize(id)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const { data, options } = await request.json()
  const username_changed_at = user?.user?.username_changed_at

  if (data?.username && username_changed_at) {
    const now = dayjs()
    const startDate = dayjs(username_changed_at)
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
  const result = await supabase
    .from('profiles')
    .update(data)
    .eq('id', id)
    .select('*')
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
