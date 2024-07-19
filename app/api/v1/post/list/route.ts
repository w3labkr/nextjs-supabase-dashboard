import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidates } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'
import { type Tag } from '@/types/database'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') as string
  const postType = (searchParams.get('postType') as string) ?? 'post'
  const status = searchParams.get('status') as string
  const isFavorite = +((searchParams.get('isFavorite') as string) ?? '0')
  const tag = searchParams.get('tag') as string
  const q = searchParams.get('q') as string
  const orderBy = (searchParams.get('orderBy') as string) ?? 'id'
  const order = (searchParams.get('order') as string) ?? 'asc'
  const limit = +((searchParams.get('limit') as string) ?? '0')

  let perPage = +((searchParams.get('perPage') as string) ?? '50')
  let page = +((searchParams.get('page') as string) ?? '1')
  let offset = (page - 1) * perPage

  if (page < 1) page = 1
  if (perPage < 1) perPage = 1
  if (offset < 0) offset = 0

  const supabase = createClient()

  let tagIds: number[] = []

  if (tag) {
    const tagSlugs: string[] = tag
      ?.split(',')
      ?.map((s: string) => s.trim())
      ?.filter(Boolean)

    const tagQuery = supabase
      .from('tags')
      .select('*, meta:tagmeta(*)')
      .in('slug', tagSlugs)

    if (userId) tagQuery.eq('user_id', userId)

    const { data } = await tagQuery

    if (Array.isArray(data) && data?.length > 0) {
      tagIds = data?.map((x: Tag) => x.id)
    }
  }

  let columns: string = '*, author:users(*), meta:postmeta(*)'

  if (isFavorite) columns += ', favorites!inner(*)'
  if (tagIds?.length > 0) columns += ', post_tags!inner(*)'

  let match: Record<string, any> = {}

  if (userId) match = { ...match, user_id: userId }
  if (postType) match = { ...match, type: postType }
  if (status) match = { ...match, status }
  if (isFavorite) match = { ...match, 'favorites.is_favorite': true }

  const totalQuery = supabase.from('posts').select(columns, {
    count: 'exact',
    head: true,
  })

  if (Object.keys(match).length > 0) totalQuery.match(match)
  if (!status) totalQuery.neq('status', 'trash')
  if (tagIds?.length > 0) totalQuery.in('post_tags.tag_id', tagIds)
  if (q) totalQuery.textSearch('title_description', q)

  const total = await totalQuery

  if (total?.error) {
    return NextResponse.json(
      { data: null, count: null, error: total?.error },
      { status: 400 }
    )
  }

  const listQuery = supabase.from('posts').select(columns)

  if (Object.keys(match).length > 0) listQuery.match(match)
  if (!status) listQuery.neq('status', 'trash')
  if (tagIds?.length > 0) listQuery.in('post_tags.tag_id', tagIds)
  if (q) listQuery.textSearch('title_description', q)

  listQuery.order(orderBy, { ascending: order === 'asc' })

  if (limit) {
    listQuery.limit(limit)
  } else {
    listQuery.range(offset, page * perPage - 1)
  }

  const { data: list, error } = await listQuery

  if (error) {
    return NextResponse.json(
      { data: null, count: null, error },
      { status: 400 }
    )
  }

  const count = limit ? list?.length : (total?.count ?? 0)
  const data = list?.map((item: any, index: number) => {
    item['num'] = limit ? index + 1 : count - index - offset
    return item
  })

  return NextResponse.json({ data, count, error: null })
}
