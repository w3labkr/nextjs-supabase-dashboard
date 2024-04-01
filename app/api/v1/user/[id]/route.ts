import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { responseJson, generateUserRole } from '@/lib/utils'
import { authorize } from '@/hooks/async/user'

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const { user } = await authorize(id)
  if (!user) return responseJson(401)

  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select(
      `username, has_set_password, is_ban, banned_until, raw_appearance, deleted_at,
       user_roles(role)`
    )
    .eq('id', id)
    .limit(1)
    .single()

  if (error) return responseJson(400, { error: error?.message })

  const { user_roles, ...users } = data

  return responseJson(200, {
    data: {
      ...user,
      user: users,
      user_role: generateUserRole(user_roles[0]?.role),
    },
  })
}

export async function POST(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const { user } = await authorize(id)
  if (!user) return responseJson(401)

  const body = await request.json()

  if (!body) {
    return responseJson(400, { error: 'Require is not defined.' })
  }

  const supabase = createClient()
  const { error } = await supabase.from('users').update(body).eq('id', id)

  if (error) return responseJson(400, { error: error?.message })

  return responseJson(200)
}
