import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidates } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'
import { Post } from '@/types/database'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') as string
  const postType = (searchParams.get('postType') as string) ?? 'post'
  const status = (searchParams.get('status') as string) ?? 'publish'
  const q = searchParams.get('q') as string
  // const orderBy = (searchParams.get('orderBy') as string) ?? 'id'
  const order = (searchParams.get('order') as string) ?? 'asc'
  const limit = +((searchParams.get('limit') as string) ?? '0')

  let page = +((searchParams.get('page') as string) ?? '1')
  let perPage = +((searchParams.get('perPage') as string) ?? '50')
  let offset = (page - 1) * perPage

  if (page < 1) page = 1
  if (perPage < 1) perPage = 1
  if (offset < 0) offset = 0

  const supabase = createClient()
  const counterQuery = supabase
    .from('posts')
    .select('*, author:users(*), meta:post_metas(*)', {
      count: 'exact',
      head: true,
    })
    .match({ user_id: userId, type: postType, status })

  if (q) counterQuery.textSearch('title', q)

  const counter = await counterQuery

  if (counter?.error) {
    return NextResponse.json(
      { data: null, count: null, error: counter?.error },
      { status: 400 }
    )
  }

  const { data: list, error } = await supabase
    .rpc('get_posts_by_meta', {
      userid: userId,
      posttype: postType,
      poststatus: status,
      textsearch: q,
      metakey: 'views',
      ascending: order === 'asc',
      count: limit > 0 ? limit : undefined,
      range: limit === 0 ? [offset, page * perPage - 1] : undefined,
    })
    .select('*, author:users(*), meta:post_metas(*)')

  if (error) {
    return NextResponse.json(
      { data: null, count: null, error },
      { status: 400 }
    )
  }

  const count = limit ? list?.length : counter?.count ?? 0

  const data = list?.map((item: Post, index: number) => {
    item['num'] = limit ? index + 1 : count - index - offset
    return item
  })

  return NextResponse.json({ data, count, error: null })
}
