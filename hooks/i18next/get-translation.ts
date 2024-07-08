'use server'

import { promises as fs } from 'fs'
import path from 'path'
import { cookies } from 'next/headers'
import { defaultLng } from '@/i18next.config'

export interface Translation {
  t: Record<string, string>
}

export async function getTranslation(
  ns: string = 'translation'
): Promise<Translation> {
  const lng = cookies().get('app:language')?.value ?? defaultLng

  const filePath = path.join(process.cwd(), `/public/locales/${lng}/${ns}.json`)
  const file = await fs.readFile(filePath, 'utf8')

  const t: Translation['t'] =
    typeof file === 'string' ? JSON.parse(file) : ({} as JSON)

  return { t }
}
