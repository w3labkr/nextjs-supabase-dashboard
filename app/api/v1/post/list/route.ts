import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ApiError } from '@/lib/utils'
import { authorize } from '@/hooks/async/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const user_id = searchParams.get('uid') as string
  const page = +((searchParams.get('page') as string) ?? '1')
  const perPage = +((searchParams.get('perPage') as string) ?? '50')
  const status = searchParams.get('status') as string
  const post_type = (searchParams.get('post_type') as string) ?? 'post'

  let match = {}

  if (user_id) match = { ...match, user_id }
  if (status) match = { ...match, status }
  if (post_type) match = { ...match, post_type }

  const supabase = createClient()
  const totalQuery = supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .match(match)

  if (!status) totalQuery.neq('status', 'trash')

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
    .match(match)
    .range((page - 1) * perPage, page * perPage - 1)
    .order('created_at', { ascending: false })

  if (!status) listQuery.neq('status', 'trash')

  const list = await listQuery

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
