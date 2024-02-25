import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const supabase = createClient()
  const signed = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  // in staging, we don't verify primary emails
  // Supabase returns a nice error
  if (signed?.error) {
    return NextResponse.json({ error: signed?.error })
  }

  if (!signed?.data?.user) {
    return NextResponse.json({
      error: { code: 'ApiError', message: 'User data is invalid.' },
    })
  }

  // in production, we verify primary emails
  // supabase returns a user object with no identities if the user exists
  if (signed?.data?.user?.identities?.length === 0) {
    return NextResponse.json({
      error: { code: 'ApiError', message: 'User already registered' },
    })
  }

  const res = await supabase.auth.signOut()

  return NextResponse.json({ error: res?.error })
}
