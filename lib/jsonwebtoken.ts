import * as jwt from 'jsonwebtoken'
import {
  Secret,
  SignOptions,
  JwtPayload,
  VerifyOptions,
  VerifyErrors,
} from 'jsonwebtoken'

export const secret: Secret = process.env.JWT_SECRET!

export function jwtSign(
  payload: string | object | Buffer,
  options?: SignOptions
): string {
  return jwt.sign(payload, secret, { algorithm: 'HS256', ...options })
}

export type JwtVerify =
  | { payload: string | JwtPayload; error: null }
  | { payload: null; error: VerifyErrors }

export function jwtVerify(
  token: string,
  options?: VerifyOptions & { complete?: false }
): JwtVerify {
  try {
    const decoded = jwt.verify(token, secret, options)
    return { payload: decoded, error: null }
  } catch (e: unknown) {
    return { payload: null, error: e as VerifyErrors }
  }
}
