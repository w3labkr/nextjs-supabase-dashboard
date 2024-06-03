import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidatePaths } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'
import { Post } from '@/types/database'

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

  const columns =
    '*, author:users(*), meta:post_metas(*), favorite:favorites!inner(*)'

  const supabase = createClient()
  const totalQuery = supabase
    .from('posts')
    .select(columns, { count: 'exact', head: true })
    .match(match)

  const total = await totalQuery
  const totalPost = total?.count ?? 0
  const startPost = (page - 1) * perPage
  const endPost = page * perPage - 1

  const { data: list, error } = await supabase
    .from('posts')
    .select(columns)
    .match(match)
    .range(startPost, endPost)
    .order('id', { ascending: false })

  if (error) {
    return NextResponse.json(
      { data: null, count: null, error },
      { status: 400 }
    )
  }

  const data = list?.map((item: Post, index: number) => {
    item['num'] = totalPost - startPost - index
    return item
  })

  return NextResponse.json({ data, count: totalPost, error: null })
}
