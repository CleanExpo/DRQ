"use client";

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface NavigationLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const NavigationLink: React.FC<NavigationLinkProps> = ({
  href,
  children,
  className = '',
  onClick
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
    router.push(href);
  };

  return (
    <button 
      onClick={handleClick}
      className={`${className} bg-transparent border-none cursor-pointer`}
    >
      {children}
    </button>
  );
};
