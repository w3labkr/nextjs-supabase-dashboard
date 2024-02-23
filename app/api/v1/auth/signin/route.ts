import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const supabase = createClient()
  const signed = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (!signed?.data?.user) {
    return NextResponse.json({
      ...signed,
      error: { code: 'ApiError', message: 'Your user data is invalid.' },
    })
  }

  return NextResponse.json(signed)
}
