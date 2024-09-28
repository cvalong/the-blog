import { Post } from '@/interfaces/post';
import { getAllPosts } from '@/app/blog/utils';
import Link from 'next/link';

export default function BlogPage() {
  const posts = getAllPosts() ?? [];

  return (
    <main className='bg-[#f3f0e8] dark:bg-[#18251D] flex flex-col justify-start md:grid md:grid-cols-[1fr_640px_1fr]'>
      <div className='space-y-4 py-10 px-6 md:col-start-2'>
        <h1 className='text-2xl font-bold'>All Blogs</h1>
        <AllBlogs posts={posts} />
      </div>
    </main>
  );
}

type AllBlogsProps = {
  posts: Post[];
};

function AllBlogs({ posts }: AllBlogsProps) {
  return (
    <ul className='space-y-2'>
      {posts.map(({ slug, title }) => (
        <li key={slug}>
          <Link href={`/blog/${slug}`} className='hover:underline'>
            {title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
