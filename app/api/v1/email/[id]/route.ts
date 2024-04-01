import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { responseJson } from '@/lib/utils'
import { authorize } from '@/hooks/async/user'

export async function POST(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const { user } = await authorize(id)
  if (!user) return responseJson(401)

  const body = await request.json()

  if (!body?.email) {
    return responseJson(400, { error: 'Require is not defined.' })
  }

  const supabaseAdmin = createAdminClient()
  const { error } = await supabaseAdmin.updateUserById(id, {
    email: body?.email,
    user_metadata: { email: body?.email },
  })

  if (error) return responseJson(400, { error: error?.message })

  return responseJson(200)
}
