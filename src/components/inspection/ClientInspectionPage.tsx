'use client';

import { InspectionForm } from './InspectionForm';
import { InspectionReport } from '@/types/inspectionTypes';

export function ClientInspectionPage() {
  const handleSubmit = (report: InspectionReport) => {
    // In a real application, this would send the report to your backend
    console.log('Inspection report submitted:', report);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Property Inspection Report
        </h1>
        <p className="text-gray-600 mb-8">
          Complete the inspection form below following IICRC standards and guidelines.
        </p>
        
        <InspectionForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
