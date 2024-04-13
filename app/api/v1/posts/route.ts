import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const user_id = searchParams.get('user_id') as string
  const page = +((searchParams.get('page') as string) ?? '1')
  const perPage = +((searchParams.get('perPage') as string) ?? '50')

  const supabase = createClient()
  const totalQuery = supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'publish')

  if (user_id) totalQuery.eq('user_id', user_id)

  const total = await totalQuery

  if (total?.error) {
    return NextResponse.json(
      { data: null, count: null, error: total?.error },
      { status: 400 }
    )
  }

  const listQuery = supabase
    .from('posts')
    .select('*, user:users!inner(*)')
    .eq('status', 'publish')

  if (user_id) listQuery.eq('user_id', user_id)

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
    count: total?.count,
    error: null,
  })
}
