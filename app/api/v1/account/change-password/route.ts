import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const supabase = createClient()
  const verified = await supabase.rpc('verify_user_password', {
    password: formData.get('oldPassword') as string,
  })

  if (verified?.error) {
    return NextResponse.json(verified)
  }

  if (verified?.data === false) {
    return NextResponse.json({
      ...verified,
      error: {
        code: 'ApiError',
        message: 'invalid_old_password',
      },
    })
  }

  const updated = await supabase.auth.updateUser({
    password: formData.get('newPassword') as string,
  })

  return NextResponse.json(updated)
}
