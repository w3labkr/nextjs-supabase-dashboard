import { revalidatePath, revalidateTag } from 'next/cache'

export function revalidates(options: {
  revalidatePaths?: string | string[] | null
  revalidateTags?: string | string[] | null
  [key: string]: any
}): boolean {
  let revalidated: boolean = false

  if (options?.revalidatePaths) {
    revalidated = revalidatePaths(options?.revalidatePaths)
  }

  if (options?.revalidateTags) {
    revalidated = revalidateTags(options?.revalidateTags)
  }

  return revalidated
}

export function revalidatePaths(paths?: string | string[] | null): boolean {
  let revalidated: boolean = false

  if (Array.isArray(paths) && paths?.length > 0) {
    paths.forEach((path: string) => {
      revalidatePath(encodeURI(path))
      revalidated = true
    })
  } else if (typeof paths === 'string') {
    revalidatePath(encodeURI(paths))
    revalidated = true
  }

  return revalidated
}

export function revalidateTags(tags?: string | string[] | null): boolean {
  let revalidated: boolean = false

  if (Array.isArray(tags) && tags?.length > 0) {
    tags.forEach((path: string) => {
      revalidateTag(path)
      revalidated = true
    })
  } else if (typeof tags === 'string') {
    revalidateTag(tags)
    revalidated = true
  }

  return revalidated
}
