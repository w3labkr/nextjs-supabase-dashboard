import { Meta } from '@/types/database'

export function getMeta<T extends Meta | undefined>(
  meta: T,
  key: string,
  defaultValue?: string | null
): any {
  return (
    meta?.find((r: Record<string, any>) => r.meta_key === key)?.meta_value ??
    defaultValue
  )
}

export function setMeta<T extends Meta | undefined>(
  meta: T,
  key: string,
  value: string | null,
  options?: Record<string, any>
): Meta | undefined {
  if (!meta) return undefined

  const found: boolean = !!meta?.find(
    (r: Record<string, any>) => r.meta_key === key
  )

  if (found) {
    const newMeta: Meta = meta?.map((r: Record<string, any>) => {
      if (r.meta_key === key) r.meta_value = value
      return r
    })
    return newMeta
  }

  const data: Record<string, any> = options
    ? Object.assign({}, { meta_key: key, meta_value: value }, options)
    : { meta_key: key, meta_value: value }

  const newMeta: Meta = [...meta, data]

  return newMeta
}
