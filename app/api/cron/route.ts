import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'

export async function GET(request: NextRequest) {
  return Response.json({ success: true })
}
