import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidates } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'

import { transporter, sender } from '@/lib/nodemailer'
import { jwtSign } from '@/lib/jsonwebtoken'
import { VerifyTokenPayload } from '@/types/token'

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') as string

  const { data, options } = await request.json()
  const { authorized } = await authorize(userId)

  if (!authorized) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const payload: VerifyTokenPayload = {
    email: data?.email,
    user_id: userId,
  }
  const mailOptions = mailTemplate(payload)

  try {
    const info = await transporter.sendMail(mailOptions)

    return NextResponse.json({
      data: info,
      error: null,
      revalidated: revalidates(options),
      now: Date.now(),
    })
  } catch (e: unknown) {
    return NextResponse.json(
      { data: null, error: new ApiError(400, (e as Error)?.message) },
      { status: 400 }
    )
  }
}

function mailTemplate(payload: VerifyTokenPayload) {
  const url = generate_url(payload)

  return {
    from: `"${sender?.name}" <${sender?.email}>`,
    to: payload?.email,
    subject: 'Email Verification',
    html: `
      <div>
        <h2>Verify Link</h2>
        <p>Click the link below to verify your email:</p>
        <p><a href="${url}">Verify email address</a></p>
      </div>
    `,
  }
}

function generate_url(payload: string | object | Buffer) {
  const token_hash = jwtSign(payload, { expiresIn: '10m' })
  const url = new URL(process.env.NEXT_PUBLIC_SITE_URL!)
  url.pathname = '/api/verify/email'
  url.searchParams.set('token_hash', token_hash)
  url.searchParams.set('next', '/dashboard/settings/emails')

  return url.toString()
}
