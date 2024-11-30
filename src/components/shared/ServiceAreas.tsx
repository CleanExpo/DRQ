import React from 'react';
import { SERVICE_AREAS } from '../../constants/areas';

export const ServiceAreas = () => {
  return (
    <section className="px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Service Areas</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {SERVICE_AREAS.map((area, index) => (
          <div 
            key={index}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            {area}
          </div>
        ))}
      </div>
    </section>
  );
};
