import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ApiError } from '@/lib/utils'
import { authorize } from '@/hooks/async/auth'

export async function PUT(request: NextRequest) {
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
