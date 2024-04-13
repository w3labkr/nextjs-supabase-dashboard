import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { ApiError } from '@/lib/utils'
import { getUser } from '@/hooks/async/auth'

export async function GET(request: NextRequest) {
  const { user, role } = await getUser()

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  if (!role?.isAdmin) {
    return NextResponse.json(
      { data: null, error: new ApiError(403) },
      { status: 403 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const page = +((searchParams.get('page') as string) ?? '1')
  const perPage = +((searchParams.get('perPage') as string) ?? '50')

  const supabaseAdmin = createAdminClient()
  const result = await supabaseAdmin.listUsers({ page, perPage })

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  return NextResponse.json({ data: result?.data, error: null })
}
