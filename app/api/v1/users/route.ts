import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { authenticate } from '@/lib/supabase/auth'

export async function GET(request: NextRequest) {
  const { authenticated, user } = await authenticate()

  if (!authenticated) {
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
    const supabase = createAdminClient()
    const response = await supabase.auth.admin.listUsers({
      page: +(searchParams.get('page') as string) ?? 1,
      perPage: +(searchParams.get('perPage') as string) ?? 50,
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
