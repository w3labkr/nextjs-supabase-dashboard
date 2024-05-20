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
  if (status) match = { ...match, status: status }

  match = { ...match, 'favorites.is_favorite': true }

  const supabase = createClient()
  const total = await supabase
    .from('posts')
    .select('*, favorite:favorites!inner(*)', { count: 'exact', head: true })
    .match(match)

  if (total?.error) {
    return NextResponse.json(
      { data: null, count: null, error: total?.error },
      { status: 400 }
    )
  }

  const list = await supabase
    .from('posts')
    .select(
      '*, author:profiles!inner(*), meta:post_metas!inner(*), favorite:favorites!inner(*)'
    )
    .match(match)
    .range((page - 1) * perPage, page * perPage - 1)
    .order('created_at', { ascending: false })

  if (list?.error) {
    return NextResponse.json(
      { data: null, count: null, error: list?.error },
      { status: 400 }
    )
  }

  return NextResponse.json({
    data: list?.data?.map((r) => setMeta(r)),
    count: total?.count ?? 0,
    error: null,
  })
}
