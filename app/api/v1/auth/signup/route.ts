import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const formData = await request.formData()

  const signed = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  // in staging, we don't verify primary emails
  // Supabase returns a nice error
  if (signed?.error || !signed?.data?.user) {
    return NextResponse.json(signed)
  }

  // in production, we verify primary emails
  // supabase returns a user object with no identities if the user exists
  if (signed?.data?.user?.identities?.length === 0) {
    return NextResponse.json({
      ...signed,
      error: {
        code: 'ApiError',
        message: 'User already registered.',
        i18n: 'user_already_registered',
      },
    })
  }

  const outed = await supabase.auth.signOut()

  return NextResponse.json(outed)
}
