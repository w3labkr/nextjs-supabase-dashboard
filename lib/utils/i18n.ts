'use server'

import { promises as fs } from 'fs'
import { cookies } from 'next/headers'
import { defaultLng } from '@/i18next.config'

export type Translation = Record<string, string>

export async function getTranslation<JSON = any>(
  ns: string = 'translation'
): Promise<JSON> {
  const lng = cookies().get('i18n:resolvedLanguage')?.value ?? defaultLng

  if (lng && ns) {
    const file = await fs.readFile(
      process.cwd() + `/public/locales/${lng}/${ns}.json`,
      'utf8'
    )
    if (typeof file === 'string') return JSON.parse(file)
  }

  return {} as JSON
}
