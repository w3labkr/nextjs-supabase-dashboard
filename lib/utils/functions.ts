import { type Tag } from '@/lib/emblor'
import { type Meta } from '@/types/database'

export function setMeta<T extends Meta[] | undefined>(
  meta: T,
  key: string,
  value: string | null,
  options?: { [x: string]: any }
): T {
  const found: boolean = !!meta?.find((r: Meta) => r.meta_key === key)

  if (meta && found) {
    const newMeta = meta?.map((r: Meta) => {
      if (r.meta_key === key) r.meta_value = value
      return r
    })
    return newMeta as T
  }

  const data = options
    ? Object.assign({}, { meta_key: key, meta_value: value }, options)
    : { meta_key: key, meta_value: value }

  const newMeta =
    Array.isArray(meta) && meta?.length > 0 ? [...meta, data] : [data]

  return newMeta as T
}

export function getMeta(
  meta: Meta[] | undefined,
  key: string
): Meta | undefined {
  return meta?.find((r: Meta) => r.meta_key === key)
}

export function getMetaValue(
  meta: Meta[] | undefined,
  key: string,
  defaultValue: string = ''
): string {
  return meta?.find((r: Meta) => r.meta_key === key)?.meta_value ?? defaultValue
}

export function compareMetaValue(
  older: Meta[] | undefined,
  newer: Meta,
  key: string
): boolean {
  const oldValue: string =
    older?.find((r: Meta) => r.meta_key === key)?.meta_value ?? ''
  const newValue: string = newer?.meta_value ?? ''

  return oldValue === newValue
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
