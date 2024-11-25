'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface ClientLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export const ClientLink: React.FC<ClientLinkProps> = ({ href, className, children }) => {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};
