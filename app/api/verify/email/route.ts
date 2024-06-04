import { NextResponse, type NextRequest } from 'next/server'
import { authorize } from '@/queries/server/auth'
import { createClient } from '@/supabase/server'
import { jwtVerify } from '@/lib/jsonwebtoken'
import { VerifyTokenPayload } from '@/types/token'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const next = (searchParams.get('next') as string) ?? '/'
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next

  const token_hash = (searchParams.get('token_hash') as string) ?? ''
  const token = jwtVerify(token_hash)

  if (token?.error) {
    return new Response(token?.error?.name, { status: 401 })
  }

  const payload = token?.payload as VerifyTokenPayload
  const { authorized, user } = await authorize(payload?.user_id)

  if (!authorized) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient()
  const updated = await supabase
    .from('emails')
    .update({ email_confirmed_at: new Date().toISOString() })
    .eq('user_id', payload?.user_id)
    .eq('email', payload?.email)
    .select('*')
    .single()

  if (updated?.error) {
    return new Response(updated?.error?.message, { status: 400 })
  }

  // If your verification email is your primary email, update it.
  if (
    user?.app_metadata?.provider === 'email' &&
    payload?.email === user?.email
  ) {
    const verified = await supabase.auth.updateUser({
      data: { email_verified: true },
    })
    if (verified?.error) {
      return new Response(verified?.error?.message, { status: 400 })
    }
  }

  // return the user to an error page with some instructions
  // redirectTo.pathname = '/auth/auth-code-error'
  // return NextResponse.redirect(redirectTo)

  return NextResponse.redirect(redirectTo)
}
