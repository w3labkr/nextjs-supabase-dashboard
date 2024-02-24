import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const supabase = createClient()
  const updated = await supabase.auth.updateUser({
    password: formData.get('password') as string,
  })

  if (updated?.error) {
    return NextResponse.json({ error: updated?.error })
  }

  if (!updated?.data?.user) {
    return NextResponse.json({
      error: { code: 'ApiError', message: 'User data is invalid.' },
    })
  }

  const res = await supabase.auth.signOut()

  return NextResponse.json({ error: res?.error })
}
