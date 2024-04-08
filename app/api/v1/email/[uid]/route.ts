import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { ApiError } from '@/lib/utils'
import { authorize } from '@/hooks/async/user'

export async function POST(
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
  const supabaseAdmin = createAdminClient()
  const result = await supabaseAdmin.updateUserById(uid, {
    email: body?.email,
    user_metadata: { email: body?.email },
  })

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  return NextResponse.json({ data: null, error: null })
}
