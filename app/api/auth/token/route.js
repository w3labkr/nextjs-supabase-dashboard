import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req, res) {
  const getCookies = cookies();
  const nextAuthSession = getCookies.get('next-auth.session-token')?.value || '';

  return NextResponse.json(nextAuthSession);
}
