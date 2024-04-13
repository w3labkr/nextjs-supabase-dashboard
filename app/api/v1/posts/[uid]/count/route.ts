import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ApiError } from '@/lib/utils'
import { authorize } from '@/hooks/async/auth'
import { CountPosts } from '@/types/database'

const defaultValues: CountPosts[] = [
  { status: 'publish', count: 0 },
  { status: 'future', count: 0 },
  { status: 'draft', count: 0 },
  { status: 'pending', count: 0 },
  { status: 'private', count: 0 },
  { status: 'trash', count: 0 },
]

export async function GET(
  request: NextRequest,
  { params: { uid } }: { params: { uid: string } }
) {
  const { user } = await authorize(uid)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const result = await supabase.rpc('count_posts', { uid })

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  const merged = defaultValues.map((val) => {
    const obj = result?.data?.find((o) => o.status === val.status)
    return obj ? { ...val, count: obj.count } : val
  })

  const data: CountPosts[] = [
    {
      status: 'all',
      count: merged.reduce((acc, obj) => acc + obj.count, 0),
    },
    ...merged,
  ]

  return NextResponse.json({ data, error: null })
}
