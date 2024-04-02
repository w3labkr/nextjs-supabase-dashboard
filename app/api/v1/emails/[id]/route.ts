import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { httpStatusText } from '@/lib/utils'
import { authorize } from '@/hooks/async/user'

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const { user } = await authorize(id)

  if (!user) {
    return NextResponse.json(
      { data: null, error: { message: httpStatusText(401) } },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const result = await supabase.from('emails').select().eq('user_id', id)

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: { message: result?.error?.message } },
      { status: 400 }
    )
  }

  return NextResponse.json({ data: result?.data, error: null })
}

export async function PUT(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const { user } = await authorize(id)

  if (!user) {
    return NextResponse.json(
      { data: null, error: { message: httpStatusText(401) } },
      { status: 401 }
    )
  }

  const body = await request.json()
  const supabase = createClient()
  const result = await supabase.from('emails').insert({ ...body, user_id: id })

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: { message: result?.error?.message } },
      { status: 400 }
    )
  }

  return NextResponse.json({ data: null, error: null })
}

export async function DELETE(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const { user } = await authorize(id)

  if (!user) {
    return NextResponse.json(
      { data: null, error: { message: httpStatusText(401) } },
      { status: 401 }
    )
  }

  const body = await request.json()
  const supabase = createClient()
  const result = await supabase
    .from('emails')
    .delete()
    .eq('user_id', id)
    .eq('email', body?.email)

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: { message: result?.error?.message } },
      { status: 400 }
    )
  }

  return NextResponse.json({ data: null, error: null })
}
