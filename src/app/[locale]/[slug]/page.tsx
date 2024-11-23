import { Metadata } from 'next';
import { generateServiceSchema } from '@/utils/seoUtils';
import { i18nConfig } from '@/config/project.config';
import type { ServicePage, Location } from '@/utils/seoUtils';

interface Props {
  params: {
    locale: string;
    slug: string;
  };
}

async function getServiceData(locale: string, slug: string): Promise<ServicePage | null> {
  // This will be implemented to fetch data from your CMS or data source
  return null;
}

async function getLocationData(slug: string): Promise<Location | null> {
  // This will be implemented to fetch location data
  return null;
}

export async function generateStaticParams() {
  const services = ['water-damage', 'fire-damage', 'mold-remediation'];
  const paths = i18nConfig.locales.flatMap(locale =>
    services.map(service => ({
      locale,
      slug: service,
    }))
  );

  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceData(params.locale, params.slug);
  const location = await getLocationData(params.slug);

  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested service page could not be found.',
    };
  }

  const schema = location ? generateServiceSchema(service, location) : null;

  return {
    title: service.title,
    description: service.metaDescription,
    alternates: {
      canonical: `https://disasterrecoveryqld.au/${params.locale}/${params.slug}`,
      languages: i18nConfig.locales.reduce((acc, locale) => ({
        ...acc,
        [locale]: `https://disasterrecoveryqld.au/${locale}/${params.slug}`
      }), {}),
    },
    ...(schema && {
      other: {
        'application/ld+json': JSON.stringify(schema),
      },
    }),
  };
}

export default async function ServicePage({ params }: Props) {
  const service = await getServiceData(params.locale, params.slug);
  const location = await getLocationData(params.slug);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">Service Not Found</h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{service.title}</h1>
        <div className="prose prose-lg max-w-none">
          {/* Service content will be rendered here */}
          {location && (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Service Area: {location.name}
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                {location.serviceArea.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
