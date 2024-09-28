import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { Post } from '@/app/blog/interfaces/post';

const postDirectory = join(process.cwd(), 'src', 'app', 'blog', 'posts');

export function getPostSlugs(): string[] {
  return fs.readdirSync(postDirectory);
}

export function getPostBySlug(slug: string): Post {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = join(postDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = matter(fileContents);
  const frontmatter = data as Omit<Post, 'slug' | 'content'>;

  return {
    ...frontmatter,
    slug: realSlug,
    content: content,
  };
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .sort((post1, post2) => (post1.publishedOn > post2.publishedOn ? -1 : 1));
  return posts;
}
