import { Meta } from '@/types/database'

export function getMeta<T extends Meta | undefined>(
  data: T,
  key: string,
  defaultValue?: string | null
): any {
  return (
    data?.find((r: Record<string, any>) => r.meta_key === key)?.meta_value ??
    defaultValue
  )
}

export function setMeta<T extends Meta | undefined>(
  data: T,
  key: string,
  value: string | null,
  options?: Record<string, any>
): Meta | undefined {
  if (!data) return undefined

  const found: boolean = !!data?.find(
    (r: Record<string, any>) => r.meta_key === key
  )

  if (found) {
    const meta: Meta = data?.map((r: Record<string, any>) => {
      if (r.meta_key === key) r.meta_value = value
      return r
    })
    return meta
  }

  const obj = { meta_key: key, meta_value: value }
  const record: Record<string, any> = options
    ? Object.assign({}, obj, options)
    : obj

  const meta: Meta = [...data, record]

  return meta
}
