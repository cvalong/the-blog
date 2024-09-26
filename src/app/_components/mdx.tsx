import Link from 'next/link';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import React from 'react';

interface CustomLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

function CustomLink(props: CustomLinkProps) {
  let href = props.href ?? '';

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith('#')) {
    return <a {...props} />;
  }

  return <a target='_blank' rel='noopener noreferrer' {...props} />;
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  children: Exclude<React.ReactNode, null | undefined>;
}

function Code({ children, ...props }: CodeProps) {
  return <code dangerouslySetInnerHTML={{ __html: children }} {...props} />;
}

function stringifyChildren(children: React.ReactNode): string {
  if (Array.isArray(children)) {
    return children.map(stringifyChildren).join('-');
  }

  if (
    typeof children === 'string' ||
    typeof children === 'number' ||
    typeof children === 'boolean'
  ) {
    return children.toString();
  }

  return '';
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

function createHeading(level: number) {
  interface HeadingProps {
    children: React.ReactNode;
  }

  const Heading = ({ children }: HeadingProps): React.JSX.Element => {
    let slug = slugify(stringifyChildren(children));

    let textSize = '';
    switch (level) {
      case 1:
        textSize = 'text-3xl';
        break;
      case 2:
        textSize = 'text-2xl';
        break;
      case 3:
        textSize = 'text-xl';
        break;
      default:
        textSize = 'text-lg';
    }

    let hClass = textSize + ' font-medium tracking-tight mt-6 mb-2';
    return React.createElement(
      `h${level}`,
      { id: slug, className: hClass },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className:
            'ml-[-1rem] pr-2 w-4/5 max-w-3xl absolute cursor no-underline hover:underline invisible hover:visible after:content-["#"] after:text-neutral-300 dark:text-neutral-700',
        }),
      ],
      children
    );
  };

  return Heading;
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  a: CustomLink,
  code: Code,
};

interface CustomMDXProps extends MDXRemoteProps {
  components?: Record<string, React.ReactElement> & typeof components;
}
export function CustomMDX(props: CustomMDXProps) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}
