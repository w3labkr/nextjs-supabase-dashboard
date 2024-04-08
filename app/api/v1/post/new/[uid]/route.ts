import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ApiError } from '@/lib/utils'
import { authorize } from '@/hooks/async/user'

export async function PUT(
  request: NextRequest,
  { params: { uid } }: { params: { uid: string } }
) {
  const { user } = await authorize(uid)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const body = await request.json()
  const supabase = createClient()
  const result = await supabase
    .from('posts')
    .insert({ ...body, user_id: uid })
    .select('*, users(*)')
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  return NextResponse.json({ data: result?.data, error: null })
}
