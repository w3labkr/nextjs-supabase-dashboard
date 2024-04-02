import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { httpStatusText, generateUserRole } from '@/lib/utils'
import { authorize } from '@/hooks/async/user'

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const { user } = await authorize(id)

  if (!user) {
    return NextResponse.json(
      { data: null, error: { message: httpStatusText(401) } },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const result = await supabase
    .from('users')
    .select(
      `username, has_set_password, is_ban, banned_until, deleted_at,
       user_roles(role)`
    )
    .eq('id', id)
    .limit(1)
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: { message: result?.error?.message } },
      { status: 400 }
    )
  }

  const { user_roles, ...users } = result.data

  const data = {
    ...user,
    user: users,
    user_role: generateUserRole(user_roles[0]?.role),
  }

  return NextResponse.json({ data, error: null })
}

export async function POST(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const { user } = await authorize(id)

  if (!user) {
    return NextResponse.json(
      { data: null, error: { message: httpStatusText(401) } },
      { status: 401 }
    )
  }

  const body = await request.json()
  const supabase = createClient()
  const result = await supabase.from('users').update(body).eq('id', id)

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: { message: result?.error?.message } },
      { status: 400 }
    )
  }

  return NextResponse.json({ data: null, error: null })
}
