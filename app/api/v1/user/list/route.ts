import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/supabase/server'
import { ApiError } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string
  const page = +((searchParams.get('page') as string) ?? '1')
  const perPage = +((searchParams.get('perPage') as string) ?? '50')

  const { user, role } = await authorize(id)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const isAdmin = role === 'admin' || role === 'superadmin'

  if (!isAdmin) {
    return NextResponse.json(
      { data: null, error: new ApiError(403) },
      { status: 403 }
    )
  }

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
