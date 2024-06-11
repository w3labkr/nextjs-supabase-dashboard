import { faker } from '@faker-js/faker'
import { slugify } from '@/lib/slugify'
import { Post } from '@/types/database'

export function generateRecentPosts(
  user_id: string,
  maximum: number = 3
): Partial<Post>[] {
  let posts: Partial<Post>[] = []

  for (let index = 0; index < maximum; index++) {
    const title = faker.lorem.sentence()

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
      slug: slugify(title ?? ''),
      content: faker.lorem.paragraphs(),
      excerpt: faker.lorem.sentence(),
      thumbnail_url: null,
      is_ban: false,
      banned_until: null,
    }
    posts = [...posts, post]
  }

  return posts
}
