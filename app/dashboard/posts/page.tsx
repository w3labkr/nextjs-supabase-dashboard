import { redirect } from 'next/navigation'

export default function PostsPage() {
  redirect('/dashboard/posts/new-post')
}
