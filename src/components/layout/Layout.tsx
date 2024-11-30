import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      {children}
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="mb-2">Phone: 1300 309 361</p>
              <p className="mb-2">Email: admin@disasterrecoveryqld.au</p>
              <p>Available 24/7 for emergencies</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/services" className="hover:text-blue-400">Services</a></li>
                <li><a href="/about" className="hover:text-blue-400">About Us</a></li>
                <li><a href="/contact" className="hover:text-blue-400">Contact</a></li>
                <li><a href="/emergency" className="hover:text-blue-400">Emergency Response</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Service Areas</h3>
              <ul className="space-y-2">
                <li>Brisbane</li>
                <li>Gold Coast</li>
                <li>Sunshine Coast</li>
                <li>Regional Queensland</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Disaster Recovery Queensland. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
