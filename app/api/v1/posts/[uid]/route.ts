import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ApiError } from '@/lib/utils'
import { authorize } from '@/hooks/async/auth'

export async function GET(
  request: NextRequest,
  { params: { uid } }: { params: { uid: string } }
) {
  const { user } = await authorize(uid)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const page = +((searchParams.get('page') as string) ?? '1')
  const perPage = +((searchParams.get('perPage') as string) ?? '50')
  const status = (searchParams.get('status') as string) ?? 'all'

  const supabase = createClient()
  const totalQuery = supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', uid)

  if (status === 'all') {
    totalQuery.neq('status', 'trash')
  } else {
    totalQuery.eq('status', status)
  }

  const total = await totalQuery

  if (total?.error) {
    return NextResponse.json(
      { data: null, count: null, error: total?.error },
      { status: 400 }
    )
  }

  const listQuery = supabase
    .from('posts')
    .select('*, user:users(*), profile:profiles(*)')
    .eq('user_id', uid)

  if (status === 'all') {
    listQuery.neq('status', 'trash')
  } else {
    listQuery.eq('status', status)
  }

  const list = await listQuery
    .range((page - 1) * perPage, page * perPage - 1)
    .order('id', { ascending: false })

  if (list?.error) {
    return NextResponse.json(
      { data: null, count: null, error: list?.error },
      { status: 400 }
    )
  }

  return NextResponse.json({
    data: list?.data,
    count: total?.count ?? 0,
    error: null,
  })
}
