import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { httpStatusText } from '@/lib/utils'
import { authorize } from '@/hooks/async/user'

export async function POST(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const { user } = await authorize(id)

  if (!user) {
    return NextResponse.json(
      { data: null, error: { message: httpStatusText(401) } },
      { status: 401 }
    )
  }

  const body = await request.json()
  const supabaseAdmin = createAdminClient()
  const result = await supabaseAdmin.updateUserById(id, {
    email: body?.email,
    user_metadata: { email: body?.email },
  })

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: { message: result?.error?.message } },
      { status: 400 }
    )
  }

  return NextResponse.json({ data: null, error: null })
}
