import { NextResponse, type NextRequest } from 'next/server'
import { responseJson } from '@/lib/utils'
import { authorize } from '@/hooks/async/user'

import { transporter, sender } from '@/lib/nodemailer'
import { jwtSign } from '@/lib/jsonwebtoken'
import { VerifyTokenPayload } from '@/types/token'

export async function POST(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const { user } = await authorize(id)
  if (!user) return responseJson(401)

  const body = await request.json()
  const mailOptions = mailTemplate({ ...body, user_id: id })

  try {
    const info = await transporter.sendMail(mailOptions)

    return responseJson(200, { data: info })
  } catch (e: unknown) {
    return responseJson(400, { error: (e as Error)?.message })
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
  url.pathname = '/api/email/v1/verify'
  url.searchParams.set('token_hash', token_hash)
  url.searchParams.set('next', '/dashboard/settings/emails')

  return url.toString()
}
