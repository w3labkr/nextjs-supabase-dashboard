import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const supabase = createClient()
  const signed = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (signed?.error) {
    return NextResponse.json({ error: signed?.error })
  }

  if (!signed?.data?.user) {
    return NextResponse.json({
      error: { code: 'ApiError', message: 'User data is invalid.' },
    })
  }

  return NextResponse.json({ data: signed?.data, error: signed?.error })
}
