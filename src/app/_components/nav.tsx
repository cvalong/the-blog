import Link from 'next/link';

const navItems = {
  '/': {
    title: 'Home',
  },
  '/blog': {
    title: 'Blog',
  },
};

export function Nav() {
  return (
    <div className='lg:sticky lg:top-20'>
      <nav className='' id='nav'>
        <div className=''>
          {Object.entries(navItems).map(([path, { title }]) => (
            <Link key={path} href={path}>
              {title}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
