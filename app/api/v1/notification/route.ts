import { NextResponse, type NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ApiError } from '@/lib/utils'
import { authorize } from '@/queries/async'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const uid = searchParams.get('uid') as string

  const { user } = await authorize(uid)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const result = await supabase
    .from('notifications')
    .select()
    .eq('user_id', uid)
    .limit(1)
    .single()

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
  const uid = searchParams.get('uid') as string

  const { formData, options } = await request.json()
  const { user } = await authorize(uid)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const result = await supabase
    .from('notifications')
    .update(formData)
    .eq('user_id', uid)
    .select()
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  const originalPath = options?.revalidatePath

  if (originalPath && typeof originalPath === 'string') {
    revalidatePath(originalPath)
  } else if (originalPath && Array.isArray(originalPath)) {
    originalPath.forEach((path: string) => revalidatePath(path))
  }

  return originalPath
    ? NextResponse.json({ data: null, error: null, revalidated: true })
    : NextResponse.json({ data: null, error: null })
}
