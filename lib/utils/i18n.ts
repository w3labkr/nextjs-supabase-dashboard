'use server'

import { promises as fs } from 'fs'
import path from 'path'
import { cookies } from 'next/headers'
import { defaultLng } from '@/i18next.config'

export type Translation = Record<string, string>

export async function getTranslation<JSON = any>(
  ns: string = 'translation'
): Promise<JSON> {
  const lng = cookies().get('i18n:resolvedLanguage')?.value ?? defaultLng

  const filePath = path.join(process.cwd(), `/public/locales/${lng}/${ns}.json`)
  const file = await fs.readFile(filePath, 'utf8')

  return typeof file === 'string' ? JSON.parse(file) : ({} as JSON)
}
