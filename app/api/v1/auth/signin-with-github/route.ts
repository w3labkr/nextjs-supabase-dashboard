import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const signed = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      // A URL to send the user to after they are confirmed.
      redirectTo:
        process.env.NEXT_PUBLIC_SITE_URL +
        '/api/v1/auth/callback?next=/dashboard/dashboard',
    },
  })

  return NextResponse.json(signed)
}
