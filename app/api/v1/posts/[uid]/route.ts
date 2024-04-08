import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params: { uid } }: { params: { uid: string } }
) {
  const searchParams = request.nextUrl.searchParams
  const page = +((searchParams.get('page') as string) ?? '1')
  const perPage = +((searchParams.get('perPage') as string) ?? '50')

  const supabase = createClient()
  const total = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', uid)

  if (total?.error) {
    return NextResponse.json(
      { data: null, count: null, error: total?.error },
      { status: 400 }
    )
  }

  const result = await supabase
    .from('posts')
    .select('*, user:users(*)')
    .eq('user_id', uid)
    .range((page - 1) * perPage, page * perPage - 1)
    .order('id', { ascending: false })

  if (result?.error) {
    return NextResponse.json(
      { data: null, count: null, error: result?.error },
      { status: 400 }
    )
  }

  return NextResponse.json({
    data: result?.data,
    count: total?.count,
    error: null,
  })
}
