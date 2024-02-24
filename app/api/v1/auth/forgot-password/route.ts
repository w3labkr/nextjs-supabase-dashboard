import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const supabase = createClient()
  const sent = await supabase.auth.resetPasswordForEmail(
    formData.get('email') as string,
    {
      redirectTo:
        process.env.NEXT_PUBLIC_SITE_URL +
        '/api/v1/auth/confirm?next=/auth/reset-password',
    }
  )

  return NextResponse.json({ error: sent?.error })
}
