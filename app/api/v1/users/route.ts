import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { responseJson } from '@/lib/utils'
import { getUser } from '@/hooks/async/user'

export async function GET(request: NextRequest) {
  const { user } = await getUser()
  if (!user) return responseJson(401)
  if (!user?.user_role?.isAdmin) return responseJson(403)

  const searchParams = request.nextUrl.searchParams
  const page = searchParams.get('page') as string
  const perPage = searchParams.get('perPage') as string

  const supabaseAdmin = createAdminClient()
  const { data, error } = await supabaseAdmin.listUsers({
    page: +page ?? 1,
    perPage: +perPage ?? 50,
  })

  if (error) return responseJson(400, { error: error?.message })

  return responseJson(200, { data })
}
