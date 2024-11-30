const { locations } = require('./locations');
const { services } = require('./services');

interface Area {
  slug: string;
  name: string;
  postcode: string;
}

interface Suburb {
  slug: string;
  name: string;
  areas: Area[];
  postcode: string;
}

interface SubRegion {
  slug: string;
  name: string;
  suburbs: Suburb[];
}

interface Region {
  slug: string;
  name: string;
  subRegions: SubRegion[];
}

interface PageCount {
  regionPages: number;
  subRegionPages: number;
  suburbPages: number;
  areaPages: number;
  serviceOverviewPages: number;
  customerTypePages: number;
  homepages: number;
  total: number;
}

const calculatePages = (): PageCount => {
  const languages = 2; // en-AU, zh
  const customerTypes = 4; // residential, commercial, self-insured, insurance
  
  // Count locations
  let regionCount = 0;
  let subRegionCount = 0;
  let suburbCount = 0;
  let areaCount = 0;
  
  locations.forEach((region: Region) => {
    regionCount++;
    region.subRegions.forEach((subRegion: SubRegion) => {
      subRegionCount++;
      subRegion.suburbs.forEach((suburb: Suburb) => {
        suburbCount++;
        areaCount += suburb.areas.length;
      });
    });
  });
  
  // Calculate pages per level
  const regionPages = regionCount * services.length * languages;
  const subRegionPages = subRegionCount * services.length * languages;
  const suburbPages = suburbCount * services.length * languages;
  const areaPages = areaCount * services.length * languages;
  
  // Additional pages
  const serviceOverviewPages = services.length * languages;
  const customerTypePages = customerTypes * languages;
  const homepages = languages;
  
  const total = regionPages + subRegionPages + suburbPages + areaPages + 
                serviceOverviewPages + customerTypePages + homepages;
  
  return {
    regionPages,
    subRegionPages,
    suburbPages,
    areaPages,
    serviceOverviewPages,
    customerTypePages,
    homepages,
    total
  };
};

const pageCount = calculatePages();
console.log('Page Breakdown:');
console.log('---------------');
console.log(`Region Pages: ${pageCount.regionPages}`);
console.log(`Sub-region Pages: ${pageCount.subRegionPages}`);
console.log(`Suburb Pages: ${pageCount.suburbPages}`);
console.log(`Area Pages: ${pageCount.areaPages}`);
console.log(`Service Overview Pages: ${pageCount.serviceOverviewPages}`);
console.log(`Customer Type Pages: ${pageCount.customerTypePages}`);
console.log(`Homepages: ${pageCount.homepages}`);
console.log('---------------');
console.log(`Total Pages: ${pageCount.total}`);

module.exports = {
  calculatePages
};
