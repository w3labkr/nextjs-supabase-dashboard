import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ApiError } from '@/lib/utils'
import { authorize } from '@/hooks/async/auth'

import dayjs from 'dayjs'

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const supabase = createClient()
  const result = await supabase
    .from('profiles')
    .select()
    .eq('id', id)
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

export async function POST(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const { user } = await authorize(id)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const body = await request.json()
  const username_changed_at = user?.user?.username_changed_at

  if (body?.username && username_changed_at) {
    const d1 = dayjs(username_changed_at)
    const d2 = d1.add(1, 'month')
    const diff = d2.diff(d1, 'days')
    if (d1 < d2) {
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
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  return NextResponse.json({ data: result?.data, error: null })
}
