import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidatePaths } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') as string

  const { authorized } = await authorize(userId)

  if (!authorized) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const { data: notification, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  return NextResponse.json({ data: notification, error: null })
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') as string

  const { data, options } = await request.json()
  const { authorized } = await authorize(userId)

  if (!authorized) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const { data: notification, error } = await supabase
    .from('notifications')
    .update(data)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  const revalidated = revalidatePaths(options?.revalidatePaths)

  return NextResponse.json({
    data: notification,
    error: null,
    revalidated,
    now: Date.now(),
  })
}
