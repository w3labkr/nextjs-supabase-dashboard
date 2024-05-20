import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidatePaths, setMeta } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string
  const postId = +(searchParams.get('postId') as string)
  const userId = searchParams.get('userId') as string

  let match = {}

  if (id) match = { ...match, id }
  if (postId) match = { ...match, post_id: postId }
  if (userId) match = { ...match, user_id: userId }

  const supabase = createClient()
  const result = await supabase
    .from('favorites')
    .select('*')
    .match(match)
    .maybeSingle()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  return NextResponse.json({ data: result?.data, error: null })
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const postId = +(searchParams.get('postId') as string)
  const userId = searchParams.get('userId') as string

  const { user } = await authorize(userId)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const { data, options } = await request.json()

  const supabase = createClient()
  const result = await supabase.rpc('set_favorite', {
    postid: postId,
    userid: userId,
    isfavorite: data?.is_favorite,
  })

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  const revalidated = revalidatePaths(options?.revalidatePaths)

  return NextResponse.json({
    data: result?.data,
    error: null,
    revalidated,
    now: Date.now(),
  })
}
