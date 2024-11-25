'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface ClientButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export const ClientButton: React.FC<ClientButtonProps> = ({
  href,
  onClick,
  children,
  className = ''
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
    if (href) {
      router.push(href);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
};
