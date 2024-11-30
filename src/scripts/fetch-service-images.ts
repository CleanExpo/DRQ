import { getServiceImages, PexelsPhoto } from '../utils/pexels';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const services = [
  'water-damage-restoration',
  'mould-remediation',
  'storm-damage-repair',
  'sewage-cleanup',
  'flood-damage-cleanup'
];

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const writeStream = fs.createWriteStream(filepath);
        response.pipe(writeStream);
        writeStream.on('finish', () => {
          writeStream.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function fetchAndSaveImages() {
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  
  // Create images directory if it doesn't exist
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  for (const service of services) {
    try {
      console.log(`Fetching images for ${service}...`);
      const photos = await getServiceImages(service, 1);
      
      if (photos.length > 0) {
        const photo = photos[0];
        const imageUrl = photo.src.large2x;
        const imagePath = path.join(imagesDir, `${service}.jpg`);
        
        await downloadImage(imageUrl, imagePath);
        console.log(`Saved image for ${service}`);
      } else {
        console.log(`No images found for ${service}`);
      }
    } catch (error) {
      console.error(`Error processing ${service}:`, error);
    }
  }
}

fetchAndSaveImages().catch(console.error);
