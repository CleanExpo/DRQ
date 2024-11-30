import { getSitemapEntries } from '../../../config/sitemap';
import { generateSitemapXml } from '../../../config/sitemap';

export async function GET() {
  const entries = await getSitemapEntries();
  const xml = generateSitemapXml(entries);
  
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
