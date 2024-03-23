import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { authenticate } from '@/lib/supabase/auth'

export async function GET(request: NextRequest) {
  const { isAuthenticated, user } = await authenticate()

  if (!isAuthenticated) {
    return NextResponse.json(
      { data: null, error: { message: 'Unauthorized' } },
      { status: 401 }
    )
  }

  // if (user?.role !== 'admin') {
  //   return NextResponse.json(
  //     { data: null, error: { message: 'Forbidden' } },
  //     { status: 403 }
  //   )
  // }

  try {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') as string
    const perPage = searchParams.get('perPage') as string

    const supabaseAdmin = createAdminClient()
    const response = await supabaseAdmin.listUsers({
      page: +page ?? 1,
      perPage: +perPage ?? 50,
    })

    if (response?.error) throw new Error(response?.error?.message)

    return NextResponse.json({ data: response?.data, error: null })
  } catch (e: unknown) {
    return NextResponse.json(
      { data: null, error: { message: (e as Error)?.message } },
      { status: 400 }
    )
  }
}
