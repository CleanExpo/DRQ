export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  alt?: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

interface PexelsResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page?: string;
}

const PLACEHOLDER_IMAGE = {
  id: 1,
  width: 1920,
  height: 1080,
  url: 'https://placehold.co/1920x1080/27364B/FFFFFF/png?text=DRQ+Emergency+Services',
  alt: 'Disaster Recovery QLD Emergency Services',
  src: {
    original: 'https://placehold.co/1920x1080/27364B/FFFFFF/png?text=DRQ+Emergency+Services',
    large2x: 'https://placehold.co/1920x1080/27364B/FFFFFF/png?text=DRQ+Emergency+Services',
    large: 'https://placehold.co/1200x800/27364B/FFFFFF/png?text=DRQ+Emergency+Services',
    medium: 'https://placehold.co/800x600/27364B/FFFFFF/png?text=DRQ+Emergency+Services',
    small: 'https://placehold.co/400x300/27364B/FFFFFF/png?text=DRQ+Emergency+Services',
    portrait: 'https://placehold.co/800x1200/27364B/FFFFFF/png?text=DRQ+Emergency+Services',
    landscape: 'https://placehold.co/1200x800/27364B/FFFFFF/png?text=DRQ+Emergency+Services',
    tiny: 'https://placehold.co/200x150/27364B/FFFFFF/png?text=DRQ+Emergency+Services'
  }
};

export async function getServiceImages(query: string, count: number = 1): Promise<PexelsPhoto[]> {
  const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
  
  console.log('Pexels API Key:', PEXELS_API_KEY ? 'Present' : 'Missing');
  
  if (!PEXELS_API_KEY || PEXELS_API_KEY === 'YOUR_PEXELS_API_KEY_HERE') {
    console.warn('Pexels API key not found or invalid. Using placeholder image data.');
    return [PLACEHOLDER_IMAGE];
  }

  try {
    console.log(`Fetching Pexels images for query: "${query}"`);
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
        next: {
          revalidate: 24 * 60 * 60 // Cache for 24 hours
        }
      }
    );

    if (!response.ok) {
      console.error('Pexels API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error(`Pexels API error: ${response.statusText}`);
    }

    const data: PexelsResponse = await response.json();
    console.log(`Found ${data.total_results} total results, returning ${data.photos.length} photos`);
    
    if (data.photos.length === 0) {
      console.warn('No photos found, using placeholder image');
      return [PLACEHOLDER_IMAGE];
    }

    return data.photos;
  } catch (error) {
    console.error('Error fetching service images:', error);
    console.warn('Using placeholder image due to error');
    return [PLACEHOLDER_IMAGE];
  }
}
