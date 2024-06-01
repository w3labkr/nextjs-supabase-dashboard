import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidatePaths } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') as string
  const page = +((searchParams.get('page') as string) ?? '1')
  const perPage = +((searchParams.get('perPage') as string) ?? '50')
  const postType = (searchParams.get('postType') as string) ?? 'post'
  const status = searchParams.get('status') as string

  let match = {}

  if (userId) match = { ...match, user_id: userId }
  if (postType) match = { ...match, type: postType }
  if (status) match = { ...match, status }

  const columns = '*, user:users(*), meta:post_metas(*)'

  const supabase = createClient()
  const totalQuery = supabase
    .from('posts')
    .select(columns, { count: 'exact', head: true })
    .match(match)

  if (!status) totalQuery.neq('status', 'trash')

  const total = await totalQuery
  const listQuery = supabase.from('posts').select(columns).match(match)

  if (!status) listQuery.neq('status', 'trash')

  const { data: list, error } = await listQuery
    .range((page - 1) * perPage, page * perPage - 1)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json(
      { data: null, count: null, error },
      { status: 400 }
    )
  }

  return NextResponse.json({
    data: list,
    count: total?.count ?? 0,
    error: null,
  })
}
