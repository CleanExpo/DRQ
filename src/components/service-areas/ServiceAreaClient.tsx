// src/components/service-areas/ServiceAreaClient.tsx
'use client';

import React from 'react';

interface ServiceAreaData {
  title: string;
  description: string;
  services: string[];
}

interface ServiceAreaClientProps {
  data: ServiceAreaData;
  locale: string;
  area: string;
}

export function ServiceAreaClient({ data, locale, area }: ServiceAreaClientProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        {data.title}
      </h1>
      <p className="mt-4 text-xl text-gray-500">
        {data.description}
      </p>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {data.services.map((service, index) => (
          <div 
            key={index}
            className="relative rounded-lg border border-gray-200 p-6 shadow-sm"
          >
            <h3 className="text-lg font-medium text-gray-900">
              {service}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}