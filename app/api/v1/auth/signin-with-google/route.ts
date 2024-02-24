import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const signed = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // A URL to send the user to after they are confirmed.
      redirectTo:
        process.env.NEXT_PUBLIC_SITE_URL +
        '/api/v1/auth/callback?next=/dashboard/dashboard',
      // Google does not send out a refresh token by default,
      // so you will need to pass parameters like these to signInWithOAuth() in order to extract the provider_refresh_token:
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  return NextResponse.json({ error: signed?.error })
}
