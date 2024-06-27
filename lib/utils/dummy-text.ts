import { faker } from '@faker-js/faker'
import { Tag } from 'emblor'

import { slugify } from '@/lib/slugify'
import { setMeta } from '@/lib/utils/functions'
import { Post } from '@/types/database'

export function generateRecentPosts(
  user_id: string,
  maximum: number = 3
): Partial<Post>[] {
  let posts: Partial<Post>[] = []

  for (let i = 0; i < maximum; i++) {
    const title = faker.lorem.sentence()
    const keywords = slugify(title, { replacement: ',', lower: false })
    const metaTags: Tag[] = keywords
      ?.toLowerCase()
      ?.split(',')
      ?.map((text: string) => ({
        id: crypto.getRandomValues(new Uint32Array(1))[0].toString(),
        text,
      }))

    const post: Partial<Post> = {
      // created_at: new Date().toISOString(),
      // updated_at: new Date().toISOString(),
      deleted_at: null,
      date: faker.date.recent().toISOString(),
      user_id,
      type: 'post',
      status: 'publish',
      password: null,
      title,
      slug: slugify(title),
      description: faker.lorem.sentence(),
      keywords,
      content: faker.lorem.paragraphs(),
      thumbnail_url: null,
      is_ban: false,
      banned_until: null,
      meta: setMeta(undefined, 'tags', JSON.stringify(metaTags)),
    }

    posts = [...posts, post]
  }

  return posts
}
