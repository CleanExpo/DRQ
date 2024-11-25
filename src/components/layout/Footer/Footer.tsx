import React from 'react';
import Link from 'next/link';

interface FooterSection {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

const footerSections: FooterSection[] = [
  {
    title: 'Services',
    links: [
      { label: 'Water Damage', href: '/services/water-damage' },
      { label: 'Mould Remediation', href: '/services/mould-remediation' },
      { label: 'Sewage Cleanup', href: '/services/sewage-cleanup' },
      { label: 'Commercial Services', href: '/services/commercial' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Locations', href: '/locations' },
      { label: 'Emergency Response', href: '/emergency' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Service Areas', href: '/service-areas' },
      { label: 'Blog', href: '/blog' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Insurance Info', href: '/insurance' }
    ]
  }
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white" aria-label="Site footer">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold mb-4">{section.title}</h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © {currentYear} DRQ. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sitemap"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
