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
      user_id,
      status: 'publish',
      date: faker.date.recent().toISOString(),
      title,
      slug: slugify(title),
      excerpt: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(),
    }
    posts = [...posts, post]
  }

  return posts
}
