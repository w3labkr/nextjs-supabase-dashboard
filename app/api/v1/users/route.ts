import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { httpStatusText } from '@/lib/utils'
import { getUser } from '@/hooks/async/user'

export async function GET(request: NextRequest) {
  const { user } = await getUser()

  if (!user) {
    return NextResponse.json(
      { data: null, error: { message: httpStatusText(401) } },
      { status: 401 }
    )
  }

  if (!user?.user_role?.isAdmin) {
    return NextResponse.json(
      { data: null, error: { message: httpStatusText(403) } },
      { status: 403 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const page = searchParams.get('page') as string
  const perPage = searchParams.get('perPage') as string

  const supabaseAdmin = createAdminClient()
  const result = await supabaseAdmin.listUsers({
    page: +page ?? 1,
    perPage: +perPage ?? 50,
  })

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: { message: result?.error?.message } },
      { status: 400 }
    )
  }

  return NextResponse.json({ data: result?.data, error: null })
}
