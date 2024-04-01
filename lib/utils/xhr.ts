import { NextResponse } from 'next/server'
import { httpStatusCodes, unknownStatusCode } from '@/lib/utils'

export function responseJson<T = null, U = null>(
  status: number,
  init?: { data?: T | null; error?: U | null }
) {
  const code =
    httpStatusCodes.find((v) => v.status === status) ?? unknownStatusCode

  let error = null

  if (!init?.error && status >= 400) {
    error = { name: code?.statusText, message: code?.message }
  } else if (init?.error && typeof init?.error === 'string') {
    error = { name: code?.statusText, message: init?.error as string }
  } else {
    error = init?.error ?? null
  }

  return NextResponse.json(
    { data: init?.data ?? null, error },
    { status: +status }
  )
}
