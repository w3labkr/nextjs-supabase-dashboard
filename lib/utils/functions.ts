import { Tag } from 'emblor'
import { Meta } from '@/types/database'

export function getMeta(
  meta: Meta[] | undefined,
  key: string,
  defaultValue?: string | null
): any {
  return meta?.find((r: Meta) => r.meta_key === key)?.meta_value ?? defaultValue
}

export function setMeta(
  meta: Meta[] | null | undefined,
  key: string,
  value: string | null,
  options?: Meta
): Meta[] {
  const found: boolean = !!meta?.find((r: Meta) => r.meta_key === key)

  if (meta && found) {
    const newMeta: Meta[] = meta?.map((r: Meta) => {
      if (r.meta_key === key) r.meta_value = value
      return r
    })
    return newMeta
  }

  const data: Meta = options
    ? Object.assign({}, { meta_key: key, meta_value: value }, options)
    : { meta_key: key, meta_value: value }

  const newMeta: Meta[] =
    Array.isArray(meta) && meta?.length > 0 ? [...meta, data] : [data]

  return newMeta
}

export function compareTags(
  older: Tag[],
  newer: Tag[]
): { added: Tag[]; removed: Tag[]; updated: Tag[]; same: Tag[]; other: Tag[] } {
  const olderIds = older.map((r: Tag) => r.id)
  const newerIds = newer.map((r: Tag) => r.id)

  const added = newer.filter((r: Tag) => !olderIds.includes(r.id))
  const removed = older.filter((r: Tag) => !newerIds.includes(r.id))
  const other = newer.filter((r: Tag) => olderIds.includes(r.id))

  const updated = other.filter(
    (r: Tag) => r.text !== older.find((x) => x.id === r.id)?.text
  )
  const updatedIds = updated.map((r: Tag) => r.id)
  const same = other.filter((r: Tag) => !updatedIds.includes(r.id))

  return { added, removed, updated, same, other }
}
