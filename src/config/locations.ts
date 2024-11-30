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

export const locations: Region[] = [
  {
    slug: 'brisbane',
    name: 'Brisbane',
    subRegions: [
      {
        slug: 'brisbane-cbd',
        name: 'Brisbane CBD',
        suburbs: [
          {
            slug: 'brisbane-city',
            name: 'Brisbane City',
            postcode: '4000',
            areas: [
              { slug: 'spring-hill', name: 'Spring Hill', postcode: '4000' },
              { slug: 'petrie-terrace', name: 'Petrie Terrace', postcode: '4000' }
            ]
          },
          {
            slug: 'fortitude-valley',
            name: 'Fortitude Valley',
            postcode: '4006',
            areas: [
              { slug: 'valley-metro', name: 'Valley Metro', postcode: '4006' },
              { slug: 'valley-business', name: 'Valley Business District', postcode: '4006' }
            ]
          },
          {
            slug: 'south-brisbane',
            name: 'South Brisbane',
            postcode: '4101',
            areas: [
              { slug: 'south-bank', name: 'South Bank', postcode: '4101' },
              { slug: 'west-end', name: 'West End', postcode: '4101' }
            ]
          },
          {
            slug: 'kangaroo-point',
            name: 'Kangaroo Point',
            postcode: '4169',
            areas: [
              { slug: 'dockside', name: 'Dockside', postcode: '4169' },
              { slug: 'main-street', name: 'Main Street', postcode: '4169' }
            ]
          }
        ]
      },
      {
        slug: 'inner-north',
        name: 'Inner North Brisbane',
        suburbs: [
          {
            slug: 'newstead',
            name: 'Newstead',
            postcode: '4006',
            areas: [
              { slug: 'gasworks', name: 'Gasworks', postcode: '4006' },
              { slug: 'waterfront', name: 'Waterfront', postcode: '4006' }
            ]
          },
          {
            slug: 'teneriffe',
            name: 'Teneriffe',
            postcode: '4005',
            areas: [
              { slug: 'vernon-terrace', name: 'Vernon Terrace', postcode: '4005' },
              { slug: 'commercial-road', name: 'Commercial Road', postcode: '4005' }
            ]
          },
          {
            slug: 'bowen-hills',
            name: 'Bowen Hills',
            postcode: '4006',
            areas: [
              { slug: 'rna-showgrounds', name: 'RNA Showgrounds', postcode: '4006' },
              { slug: 'perry-park', name: 'Perry Park', postcode: '4006' }
            ]
          },
          {
            slug: 'windsor',
            name: 'Windsor',
            postcode: '4030',
            areas: [
              { slug: 'lutwyche-road', name: 'Lutwyche Road', postcode: '4030' },
              { slug: 'windsor-station', name: 'Windsor Station', postcode: '4030' }
            ]
          }
        ]
      },
      {
        slug: 'inner-south',
        name: 'Inner South Brisbane',
        suburbs: [
          {
            slug: 'woolloongabba',
            name: 'Woolloongabba',
            postcode: '4102',
            areas: [
              { slug: 'gabba-central', name: 'Gabba Central', postcode: '4102' },
              { slug: 'stanley-street', name: 'Stanley Street', postcode: '4102' }
            ]
          },
          {
            slug: 'east-brisbane',
            name: 'East Brisbane',
            postcode: '4169',
            areas: [
              { slug: 'heath-park', name: 'Heath Park', postcode: '4169' },
              { slug: 'mowbray-park', name: 'Mowbray Park', postcode: '4169' }
            ]
          },
          {
            slug: 'coorparoo',
            name: 'Coorparoo',
            postcode: '4151',
            areas: [
              { slug: 'coorparoo-square', name: 'Coorparoo Square', postcode: '4151' },
              { slug: 'old-cleveland-road', name: 'Old Cleveland Road', postcode: '4151' }
            ]
          },
          {
            slug: 'greenslopes',
            name: 'Greenslopes',
            postcode: '4120',
            areas: [
              { slug: 'greenslopes-mall', name: 'Greenslopes Mall', postcode: '4120' },
              { slug: 'logan-road', name: 'Logan Road', postcode: '4120' }
            ]
          }
        ]
      }
    ]
  },
  {
    slug: 'gold-coast',
    name: 'Gold Coast',
    subRegions: [
      {
        slug: 'gold-coast-central',
        name: 'Gold Coast Central',
        suburbs: [
          {
            slug: 'surfers-paradise',
            name: 'Surfers Paradise',
            postcode: '4217',
            areas: [
              { slug: 'cavill-avenue', name: 'Cavill Avenue', postcode: '4217' },
              { slug: 'beach-front', name: 'Beach Front', postcode: '4217' }
            ]
          },
          {
            slug: 'broadbeach',
            name: 'Broadbeach',
            postcode: '4218',
            areas: [
              { slug: 'oracle', name: 'Oracle', postcode: '4218' },
              { slug: 'pacific-fair', name: 'Pacific Fair', postcode: '4218' }
            ]
          },
          {
            slug: 'main-beach',
            name: 'Main Beach',
            postcode: '4217',
            areas: [
              { slug: 'tedder-avenue', name: 'Tedder Avenue', postcode: '4217' },
              { slug: 'marina-mirage', name: 'Marina Mirage', postcode: '4217' }
            ]
          },
          {
            slug: 'southport',
            name: 'Southport',
            postcode: '4215',
            areas: [
              { slug: 'australia-fair', name: 'Australia Fair', postcode: '4215' },
              { slug: 'broadwater', name: 'Broadwater', postcode: '4215' }
            ]
          }
        ]
      }
    ]
  }
];

export const generateLocationPaths = () => {
  const paths: string[] = [];
  
  locations.forEach(region => {
    paths.push(`/${region.slug}`);
    
    region.subRegions.forEach(subRegion => {
      paths.push(`/${region.slug}/${subRegion.slug}`);
      
      subRegion.suburbs.forEach(suburb => {
        paths.push(`/${region.slug}/${subRegion.slug}/${suburb.slug}`);
        
        suburb.areas.forEach(area => {
          paths.push(`/${region.slug}/${subRegion.slug}/${suburb.slug}/${area.slug}`);
        });
      });
    });
  });
  
  return paths;
};
