import fs from 'fs';
import path from 'path';
import https from 'https';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PEXELS_API_KEY = 'AN6Hid9mUDtsXoMBxUEH2QfgivCwTm5ngpG0gqyZnCMRKq1viTGTi5Nq';

const services = [
  'water-damage-restoration',
  'mould-remediation',
  'storm-damage-repair',
  'sewage-cleanup',
  'flood-damage-cleanup'
];

const searchQueries = {
  'water-damage-restoration': 'water damage repair restoration',
  'mould-remediation': 'mold remediation professional',
  'storm-damage-repair': 'storm damage repair',
  'sewage-cleanup': 'professional cleaning service',
  'flood-damage-cleanup': 'flood damage cleanup'
};

async function getServiceImages(serviceId, count = 1) {
  const query = searchQueries[serviceId] || serviceId;
  
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.photos;
  } catch (error) {
    console.error('Error fetching images from Pexels:', error);
    return [];
  }
}

function downloadImage(url, filepath) {
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
  const projectRoot = path.resolve(__dirname, '..', '..');
  const imagesDir = path.join(projectRoot, 'public', 'images');
  
  // Create images directory if it doesn't exist
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  for (const service of services) {
    try {
      console.log(`Fetching images for ${service}...`);
      const photos = await getServiceImages(service);
      
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
