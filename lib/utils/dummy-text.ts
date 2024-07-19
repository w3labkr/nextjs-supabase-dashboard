import { faker } from '@faker-js/faker'
import { slugify } from '@/lib/slugify'
import { type Tag, generateTagId } from '@/lib/emblor'
import { setMeta } from '@/lib/utils/functions'
import { type Post, type User } from '@/types/database'
import { absoluteUrl } from './url'

export function generateRecentPosts(
  user: User,
  maximum: number = 3
): Partial<Post>[] {
  let posts: Partial<Post>[] = []

  for (let i = 0; i < maximum; i++) {
    const title = faker.lorem.sentence()
    const slug = slugify(title)
    const keywords = slugify(title, { replacement: ',', lower: false })
    const tags: Tag[] = keywords?.split(',')?.map((tag: string) => ({
      id: generateTagId(),
      text: tag,
      slug: slugify(tag),
    }))

    const post: Partial<Post> = {
      // created_at: new Date().toISOString(),
      // updated_at: new Date().toISOString(),
      deleted_at: null,
      date: faker.date.recent().toISOString(),
      user_id: user?.id,
      type: 'post',
      status: 'publish',
      password: null,
      title,
      slug,
      description: faker.lorem.sentence(),
      keywords,
      content: faker.lorem.paragraphs(),
      thumbnail_url: null,
      permalink: absoluteUrl(`/${user?.username}/${slug}`),
      is_ban: false,
      banned_until: null,
      meta: setMeta(undefined, 'tags', JSON.stringify(tags)),
    }

    posts = [...posts, post]
  }

  return posts
}
