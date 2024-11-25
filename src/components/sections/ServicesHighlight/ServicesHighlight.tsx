'use client';

import Image from 'next/image';
import { Locale } from '../../../config/i18n.config';

interface Service {
  title: string;
  description: string;
  icon: string;
}

const services: Service[] = [
  {
    title: 'Water Damage',
    description: 'Expert water extraction and structural drying services for flood and water damage.',
    icon: '/icons/water-damage.svg'
  },
  {
    title: 'Fire Damage',
    description: 'Professional fire and smoke damage restoration services.',
    icon: '/icons/fire-damage.svg'
  },
  {
    title: 'Mould Remediation',
    description: 'Comprehensive mould detection and removal services.',
    icon: '/icons/mould.svg'
  }
];

interface ServicesHighlightProps {
  locale: Locale;
}

export const ServicesHighlight: React.FC<ServicesHighlightProps> = ({ locale }) => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Our Emergency Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 relative mr-4">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {service.title}
                </h3>
              </div>
              <p className="text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
