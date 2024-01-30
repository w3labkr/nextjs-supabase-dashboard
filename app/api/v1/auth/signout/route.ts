import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return new NextResponse('Success!', {
    status: 200,
  })
}
