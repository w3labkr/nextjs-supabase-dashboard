import { NextResponse } from 'next/server'
import statusCodes from '@/public/locales/en/httpstatuscode.json'

export interface HttpStatusCodeProps {
  statusCode: keyof typeof statusCodes
}

export function httpStatusCode(statusCode: HttpStatusCodeProps['statusCode']) {
  const obj = statusCodes[statusCode]

  return {
    status: statusCode,
    statusText: (obj?.statusText ?? '') as string,
    message: (obj?.message ?? '') as string,
  }
}

export function httpResponseCode(
  statusCode: HttpStatusCodeProps['statusCode']
) {
  return NextResponse.json(httpStatusCode(statusCode), {
    status: +statusCode,
  })
}
