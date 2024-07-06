'use server'

import { headers } from 'next/headers'

export const getUrl = (): string => headers().get('x-url') as string

export const getOrigin = (): string => headers().get('x-origin') as string

export const getPathname = (): string => headers().get('x-pathname') as string
