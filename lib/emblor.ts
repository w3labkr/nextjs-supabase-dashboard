import { Tag as EmblorTag } from 'emblor'

export type Tag = EmblorTag & {
  slug?: string
}

export function generateTagId() {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString()
}
