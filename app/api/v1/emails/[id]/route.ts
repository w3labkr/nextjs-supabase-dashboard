import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { responseJson } from '@/lib/utils'
import { authorize } from '@/hooks/async/user'

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const { user } = await authorize(id)
  if (!user) return responseJson(401)

  const supabase = createClient()
  const { data, error } = await supabase
    .from('emails')
    .select()
    .eq('user_id', id)

  if (error) return responseJson(400, { error: error?.message })

  return responseJson(200, { data })
}

export async function PUT(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const { user } = await authorize(id)
  if (!user) return responseJson(401)

  const body = await request.json()

  if (!body?.email) {
    return responseJson(400, { error: 'Require is not defined.' })
  }

  const supabase = createClient()
  const { error } = await supabase
    .from('emails')
    .insert({ ...body, user_id: id })

  if (error) return responseJson(400, { error: error?.message })

  return responseJson(200)
}

export async function DELETE(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const { user } = await authorize(id)
  if (!user) return responseJson(401)

  const body = await request.json()

  if (!body?.email) {
    return responseJson(400, { error: 'Require is not defined.' })
  }

  const supabase = createClient()
  const { error } = await supabase
    .from('emails')
    .delete()
    .eq('user_id', id)
    .eq('email', body?.email)

  if (error) return responseJson(400, { error: error?.message })

  return responseJson(200)
}
