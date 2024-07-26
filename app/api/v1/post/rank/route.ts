import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidates } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'
import { type Post } from '@/types/database'
import { getUserAPI } from '@/queries/server/users'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') as string
  const q = searchParams.get('q') as string
  const orderBy = (searchParams.get('orderBy') as string) ?? 'id'
  const order = (searchParams.get('order') as string) ?? 'asc'

  const { user } = await getUserAPI(userId)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  let perPage = +((searchParams.get('perPage') as string) ?? '50')
  let page = +((searchParams.get('page') as string) ?? '1')
  let offset = (page - 1) * perPage

  if (page < 1) page = 1
  if (perPage < 1) perPage = 1
  if (offset < 0) offset = 0

  const supabase = createClient()
  const total = await supabase.rpc(
    'get_post_rank_by_views',
    { username: user?.username, q, head: true },
    { count: 'exact' }
  )

  if (total?.error) {
    return NextResponse.json(
      { data: null, count: null, error: total?.error },
      { status: 400 }
    )
  }

  const { data: list, error } = await supabase.rpc('get_post_rank_by_views', {
    username: user?.username,
    q,
    order_by: orderBy,
    ascending: order.toLowerCase() === 'asc',
    per_page: perPage,
    page,
  })

  if (error) {
    return NextResponse.json(
      { data: null, count: null, error },
      { status: 400 }
    )
  }

  const count = total?.count ?? 0
  const data = list?.map((item: any, index: number) => {
    item['num'] = index + 1
    return item
  })

  return NextResponse.json({ data, count, error: null })
}
