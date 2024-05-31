import { Meta } from '@/types/database'

export function setMeta<T extends Record<string, any>>(
  data: T
): Omit<T, 'meta'> & { meta: Meta } {
  const meta: Meta = data?.meta?.reduce(
    (acc: Meta, obj: Record<string, any>) => {
      acc[obj.meta_key] = obj.meta_value
      return acc
    },
    {}
  )

  return { ...data, meta }
}
