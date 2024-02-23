import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  // user?.app_metadata.provider
  const supabase = createClient()
  const verified = await supabase.rpc('verify_user_email_and_password', {
    user_email: formData.get('email') as string,
    user_password: formData.get('password') as string,
  })

  if (verified?.error) {
    return NextResponse.json(verified)
  }

  if (verified?.data === false) {
    return NextResponse.json({
      ...verified,
      error: {
        code: 'ApiError',
        message: 'Your account information is invalid.',
      },
    })
  }

  const deleted = await supabase.rpc('delete_user')

  return NextResponse.json(deleted)
}
