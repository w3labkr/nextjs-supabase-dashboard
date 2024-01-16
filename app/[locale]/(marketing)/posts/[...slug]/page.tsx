import { notFound } from 'next/navigation';
import { allPosts } from 'contentlayer/generated';
import { MDXContent } from '@/components/mdx-components';

export default async function PostPage({
  params,
}: {
  params: {
    slug: string[];
  };
}) {
  // Find the post for the current page.
  const slug = params?.slug?.join('/');
  const post = allPosts.find((post) => post.slugAsParams === slug);

  // 404 if the post does not exist.
  if (!post) notFound();

  return <MDXContent code={post.body.code} />;
}
