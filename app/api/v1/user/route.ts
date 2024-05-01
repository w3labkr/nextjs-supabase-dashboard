import { NextResponse, type NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { ApiError } from '@/lib/utils'
import { authorize } from '@/queries/async'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string

  const { user } = await authorize(id)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  return NextResponse.json({ data: user, error: null })
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string

  const { formData, options } = await request.json()
  const { user } = await authorize(id)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const result = await supabase
    .from('users')
    .update(formData)
    .eq('id', id)
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
    ? NextResponse.json({ data: result?.data, error: null, revalidated: true })
    : NextResponse.json({ data: result?.data, error: null })
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string

  const { options } = await request.json()
  const { user } = await authorize(id)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabaseAdmin = createAdminClient()
  const result = await supabaseAdmin.deleteUser(id)

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
