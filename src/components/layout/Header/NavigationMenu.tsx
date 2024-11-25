import React from 'react';
import Link from 'next/link';

interface NavigationItem {
  href: string;
  label: string;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    href: '/services',
    label: 'Services',
    children: [
      { href: '/services/water-damage', label: 'Water Damage' },
      { href: '/services/mould-remediation', label: 'Mould Remediation' },
      { href: '/services/sewage-cleanup', label: 'Sewage Cleanup' }
    ]
  },
  {
    href: '/locations',
    label: 'Locations',
  },
  {
    href: '/about',
    label: 'About',
  },
  {
    href: '/contact',
    label: 'Contact',
  }
];

export const NavigationMenu: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  return (
    <nav className="hidden md:flex space-x-8" aria-label="Main navigation">
      <ul className="flex space-x-8">
        {navigationItems.map((item) => (
          <li
            key={item.href}
            className="relative"
            onMouseEnter={() => setActiveDropdown(item.href)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              href={item.href}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              aria-expanded={item.children ? activeDropdown === item.href : undefined}
            >
              {item.label}
            </Link>
            
            {item.children && activeDropdown === item.href && (
              <div
                className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                aria-label={`${item.label} submenu`}
              >
                <ul className="py-1">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationMenu;
