import { NextResponse, type NextRequest } from 'next/server'
import { authorize } from '@/hooks/async/user'
import { createClient } from '@/lib/supabase/server'
import { jwtVerify } from '@/lib/jsonwebtoken'
import { VerifyTokenPayload } from '@/types/token'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const next = searchParams.get('next') ?? '/'
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next

  const token_hash = searchParams.get('token_hash') ?? ''
  const token = jwtVerify(token_hash)

  if (token?.error) {
    return new Response(token?.error?.name, { status: 401 })
  }

  const payload = token?.payload as VerifyTokenPayload
  const { user } = await authorize(payload?.user_id)

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient()
  const result = await supabase
    .from('emails')
    .update({ email_confirmed_at: new Date().toISOString() })
    .eq('user_id', payload?.user_id)
    .eq('email', payload?.email)
    .select()
    .limit(1)
    .single()

  if (result?.error) {
    return new Response(result?.error?.message, { status: 400 })
  }

  // If your verification email is your primary email, update it.
  if (
    user?.app_metadata?.provider === 'email' &&
    payload?.email === user?.email
  ) {
    const updated = await supabase.auth.updateUser({
      data: { email_verified: true },
    })
    if (updated?.error) {
      return new Response(updated?.error?.message, { status: 400 })
    }
  }

  return NextResponse.redirect(redirectTo)

  // return the user to an error page with some instructions
  // redirectTo.pathname = '/errors/400'
  // return NextResponse.redirect(redirectTo)
}
