import { Post } from '@/interfaces/post';
import { getAllPosts } from '@/lib/api';
import Link from 'next/link';

export default function BlogPage() {
  const posts = getAllPosts() ?? [];

  return (
    <main className='bg-[#f3f0e8] dark:bg-[#18251D] flex flex-col justify-start md:grid md:grid-cols-[1fr_640px_1fr]'>
      <div className='space-y-4 py-10 px-6 md:col-start-2'>
        <h1 className='text-2xl font-bold'>All Blogs</h1>
        <AllBlogs />
        <BlogPost {...(posts[0] ?? {})} />
      </div>
    </main>
  );
}

function AllBlogs() {
  return (
    <ul className='space-y-2'>
      <li>
        <Link href='/blog/1'>Blog 1</Link>
      </li>
      <li>
        <Link href='/blog/2'>Blog 2</Link>
      </li>
    </ul>
  );
}

type PostComponentProps = Partial<Post>;

function BlogPost({ title, content, ...rest }: PostComponentProps) {
  return (
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
  );
}
