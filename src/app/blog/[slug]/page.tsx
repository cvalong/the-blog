import { getAllPosts, getPostBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';

export default function Post({ params }: Params) {
  const post = getPostBySlug(params.slug) ?? {};

  if (!post) {
    return notFound();
  }

  const { title, content, ...rest } = post;

  return (
    <main className='bg-[#f3f0e8] dark:bg-[#18251D] flex flex-col justify-start md:grid md:grid-cols-[1fr_640px_1fr]'>
      <div className='space-y-4 py-10 px-6 md:col-start-2'>
        <div className='flex flex-col gap-4'>
          <h2>{title}</h2>
          <p>{content}</p>
          {Object.entries(rest).map(([key, value], index) => (
            <div key={index}>
              <span>{key}: </span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

type Params = { params: { slug: string } };

export function generateMetadata({ params }: Params): Metadata {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | Chris Long's Blog`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
