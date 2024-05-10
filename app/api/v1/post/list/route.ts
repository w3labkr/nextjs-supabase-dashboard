import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidatePaths, setMeta } from '@/lib/utils'
import { authorize } from '@/queries/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const uid = searchParams.get('uid') as string
  const page = +((searchParams.get('page') as string) ?? '1')
  const perPage = +((searchParams.get('perPage') as string) ?? '50')
  const limit = +(searchParams.get('limit') as string)
  const status = searchParams.get('status') as string
  const postType = (searchParams.get('postType') as string) ?? 'post'

  let match = {}

  if (uid) match = { ...match, user_id: uid }
  if (postType) match = { ...match, type: postType }
  if (status) match = { ...match, status }

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
    .select('*, creator:profiles(*), meta:post_metas(*)')
    .match(match)
    .range((page - 1) * perPage, page * perPage - 1)
    .order('created_at', { ascending: false })

  if (!status) listQuery.neq('status', 'trash')
  if (limit) listQuery.limit(limit)

  const list = await listQuery

  if (list?.error) {
    return NextResponse.json(
      { data: null, count: null, error: list?.error },
      { status: 400 }
    )
  }

  const data = list?.data?.map((d) => setMeta(d))

  return NextResponse.json({
    data,
    count: total?.count ?? 0,
    error: null,
  })
}
