import { Meta } from '@/types/database'

export function getMeta(
  meta: Meta | undefined,
  key: string,
  defaultValue?: string | null
): any {
  return (
    meta?.find((r: Record<string, any>) => r.meta_key === key)?.meta_value ??
    defaultValue
  )
}

export function setMeta(
  meta: Meta | null | undefined,
  key: string,
  value: string | null,
  options?: Record<string, any>
): Meta {
  const found: boolean = !!meta?.find(
    (r: Record<string, any>) => r.meta_key === key
  )

  if (meta && found) {
    const newMeta: Meta = meta?.map((r: Record<string, any>) => {
      if (r.meta_key === key) r.meta_value = value
      return r
    })
    return newMeta
  }

  const data: Record<string, any> = options
    ? Object.assign({}, { meta_key: key, meta_value: value }, options)
    : { meta_key: key, meta_value: value }

  const newMeta: Meta =
    Array.isArray(meta) && meta?.length > 0 ? [...meta, data] : [data]

  return newMeta
}
