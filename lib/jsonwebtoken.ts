import * as jwt from 'jsonwebtoken'
import { Secret, SignOptions, JwtPayload, VerifyErrors } from 'jsonwebtoken'

const secret: Secret = process.env.JWT_SECRET!

export function jwtSign(
  payload: string | object | Buffer,
  options?: SignOptions | undefined
): string {
  return jwt.sign(payload, secret, { algorithm: 'HS256', ...options })
}

type JwtVerify =
  | { payload: string | JwtPayload; error: null }
  | { payload: null; error: VerifyErrors }

export function jwtVerify(token: string): JwtVerify {
  try {
    const decoded = jwt.verify(token, secret)
    return { payload: decoded, error: null }
  } catch (e: unknown) {
    return { payload: null, error: e as VerifyErrors }
  }
}
