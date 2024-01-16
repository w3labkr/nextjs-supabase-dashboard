import { notFound } from 'next/navigation';
import { allPages } from 'contentlayer/generated';
import { MDXContent } from '@/components/mdx-components';

export default async function Page() {
  // Find the post for the current page.
  const slug = 'terms';
  const page = allPages.find((page) => page.slugAsParams === slug);

  // 404 if the post does not exist.
  if (!page) notFound();

  return <MDXContent code={page.body.code} />;
}
