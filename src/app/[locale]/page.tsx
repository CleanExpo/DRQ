import { Hero } from '@/components/layout/Hero';
import { ServicesHighlight } from '@/components/sections/ServicesHighlight/ServicesHighlight';
import { serviceAreas } from '@/config/serviceAreas';
import { Metadata } from 'next';
import { Locale } from '@/config/i18n.config';

interface PageProps {
  params: {
    locale: Locale;
  };
}

export const metadata: Metadata = {
  title: 'Emergency Restoration Services | Disaster Recovery QLD',
  description: 'Professional emergency response for water damage, fire damage, and mould remediation. Available 24/7 across Southeast Queensland. Call 1300 309 361.',
};

export default function HomePage({ params: { locale } }: PageProps) {
  // Using a placeholder image until we have the actual hero image
  const heroImage = 'https://images.unsplash.com/photo-1562813733-b31f71025d54?auto=format&fit=crop&w=2000&q=80';

  return (
    <>
      <Hero
        backgroundImage={heroImage}
        title="24/7 Emergency Restoration Services"
        subtitle="Professional response for water damage, fire damage, and mould remediation across Southeast Queensland."
        emergencyContact="1300309361"
      />
      <ServicesHighlight locale={locale} />
      
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Service Areas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(serviceAreas).map(([key, area]) => (
              <div key={key} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {area.name}
                </h3>
                <ul className="space-y-2">
                  {area.regions.map(region => (
                    <li key={region.name} className="text-gray-600">
                      {region.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Emergency? Don't Wait
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our team is available 24/7 for emergency response across Southeast Queensland.
            Call now for immediate assistance.
          </p>
          <a
            href="tel:1300309361"
            className="inline-block bg-red-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-red-700 transition-colors"
          >
            Call 1300 309 361
          </a>
        </div>
      </section>
    </>
  );
}
