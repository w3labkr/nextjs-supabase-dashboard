import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidatePaths } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') as string
  const postType = (searchParams.get('postType') as string) ?? 'post'

  const { authorized } = await authorize(userId)

  if (!authorized) {
    return NextResponse.json(
      { data: null, count: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const result = await supabase.rpc('count_posts', {
    userid: userId,
    posttype: postType,
  })

  if (result?.error) {
    return NextResponse.json(
      { data: null, count: null, error: result?.error },
      { status: 400 }
    )
  }

  const defaultValues = [
    { status: 'publish', count: 0 },
    { status: 'future', count: 0 },
    { status: 'draft', count: 0 },
    { status: 'pending', count: 0 },
    { status: 'private', count: 0 },
    { status: 'trash', count: 0 },
  ]

  const data = defaultValues?.map((row) => {
    return result?.data?.find((r) => r.status === row.status) ?? row
  })

  const count = data?.reduce((acc, obj) => {
    if (obj.status === 'trash') return acc
    return acc + obj.count
  }, 0)

  // const orderBy = ['publish', 'draft', 'pending', 'private', 'future', 'trash']
  // const sorted = data.sort(
  //   (a, b) => orderBy.indexOf(a.status) - orderBy.indexOf(b.status)
  // )
  // const sorted = data.sort((a, b) => (a.status > b.status ? 1 : -1)) // ASC
  // const sorted = data.sort((a, b) => (a.status > b.status ? -1 : 1)) // DESC

  return NextResponse.json({ data, count, error: null })
}
