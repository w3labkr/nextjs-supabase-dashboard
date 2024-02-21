import { NextResponse } from 'next/server'
import httpStatusCode from '@/public/locales/en/httpstatuscode.json'

export type HttpStatusCodeProp = keyof typeof httpStatusCode

export function httpResponseCode(status: HttpStatusCodeProp) {
  const obj = httpStatusCode[status]

  return NextResponse.json(
    {
      status: +status,
      statusText: obj?.statusText,
      message: obj?.message,
    },
    { status: +status }
  )
}
