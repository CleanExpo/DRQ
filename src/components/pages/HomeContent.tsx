'use client';

import React from 'react';

export function HomeContent() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Expert Disaster Recovery Services
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          We provide professional disaster recovery services across Queensland, with specialized expertise in water damage restoration, fire damage repair, and mould remediation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">Water Damage</h2>
            <p className="text-blue-700">Emergency water extraction and restoration services available 24/7.</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-red-900 mb-3">Fire Damage</h2>
            <p className="text-red-700">Comprehensive fire and smoke damage restoration services.</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-green-900 mb-3">Mould Remediation</h2>
            <p className="text-green-700">Professional mould inspection and removal services.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
