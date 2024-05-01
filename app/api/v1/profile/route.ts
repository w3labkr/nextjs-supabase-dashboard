import { NextResponse, type NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ApiError } from '@/lib/utils'
import { authorize } from '@/queries/async'

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
    .select()
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

  const { user } = await authorize(id)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const { formData, options } = await request.json()
  const username_changed_at = user?.user?.username_changed_at

  if (formData?.username && username_changed_at) {
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
    .update(formData)
    .eq('id', id)
    .select()
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  const originalPath = options?.revalidatePath

  if (originalPath && typeof originalPath === 'string') {
    revalidatePath(originalPath)
  } else if (originalPath && Array.isArray(originalPath)) {
    originalPath.forEach((path: string) => revalidatePath(path))
  }

  return originalPath
    ? NextResponse.json({ data: result?.data, error: null, revalidated: true })
    : NextResponse.json({ data: result?.data, error: null })
}
