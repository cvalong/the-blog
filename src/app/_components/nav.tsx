'use client';
import Link from 'next/link';
import { useState } from 'react';
import { clsx } from '../utils';

const navItems = {
  '/': {
    title: 'Home',
  },
  '/blog': {
    title: 'Blog',
  },
  '/contact': {
    title: 'Contact',
  },
};

export function Nav() {
  const [isOpen, setOpen] = useState<'open' | 'closed'>('closed');

  function handleClick() {
    setOpen(isOpen === 'open' ? 'closed' : 'open');
  }

  return (
    <nav
      className='flex justify-between items-center p-4 border border-red-600 sticky top-0 bg-gradient-to-b from-black from-60%'
      id='nav'
    >
      <ul
        className={clsx(
          isOpen === 'open' ? 'left-0' : '-left-full',
          'fixed top-20 w-full flex flex-col md:flex-row text-center space-between items-center gap-4 bg-yellow-700 md:bg-black'
        )}
      >
        {Object.entries(navItems).map(([path, { title }]) => (
          <li key={path} className=' my-10 md:my-0 md:ml-1'>
            <Link href={path}>{title}</Link>
          </li>
        ))}
      </ul>
      <BurgerButton handleClick={handleClick} />
    </nav>
  );
}

function BurgerButton({ handleClick }: { handleClick: () => void }) {
  return (
    <button
      className='cursor-pointer md:cursor-none md:hidden'
      onClick={handleClick}
    >
      {Array.from({ length: 3 }).map((_, i) => {
        return (
          <div
            key={i}
            className='h-1 w-6 my-1 bg-white transition-all ease-in-out'
          ></div>
        );
      })}
    </button>
  );
}
