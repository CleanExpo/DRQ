import { MetadataRoute } from 'next';
import { services } from '@/config/services';
import { locations } from '@/config/locations';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://disasterrecoveryqld.au';
  const locales = ['en-AU', 'zh'];
  const currentDate = new Date().toISOString();
  
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add homepage for each locale
  locales.forEach(locale => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1
    });
  });

  // Add service pages
  services.forEach(service => {
    locales.forEach(locale => {
      // Main service page
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/services/${service.id}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.9
      });

      // Service location pages
      locations.forEach(region => {
        region.subRegions.forEach(subRegion => {
          subRegion.suburbs.forEach(suburb => {
            suburb.areas.forEach(area => {
              sitemapEntries.push({
                url: `${baseUrl}/${locale}/services/${service.id}/${region.slug}/${subRegion.slug}/${suburb.slug}/${area.slug}`,
                lastModified: currentDate,
                changeFrequency: 'weekly',
                priority: 0.8
              });
            });
          });
        });
      });
    });
  });

  // Add customer type pages
  const customerTypes = ['residential', 'commercial', 'self-insured', 'insurance'];
  customerTypes.forEach(type => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/customers/${type}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.7
      });
    });
  });

  // Add service area overview pages
  locations.forEach(region => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/locations/${region.slug}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.6
      });

      region.subRegions.forEach(subRegion => {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/locations/${region.slug}/${subRegion.slug}`,
          lastModified: currentDate,
          changeFrequency: 'monthly',
          priority: 0.5
        });
      });
    });
  });

  return sitemapEntries;
}

// Helper function to format date for sitemap
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
