import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidatePaths, setMeta } from '@/lib/utils'
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
    .select('*, author:profiles(*), meta:post_metas(*)')
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

  const data = list?.data?.map((d) => setMeta(d))

  return NextResponse.json({
    data,
    count: total?.count ?? 0,
    error: null,
  })
}
