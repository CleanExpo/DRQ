import { Metadata } from 'next';
import { ClientInspectionPage } from '@/components/inspection/ClientInspectionPage';

export const metadata: Metadata = {
  title: 'Property Inspection Report | DRQ',
  description: 'Create detailed property inspection reports following IICRC standards for water, fire, and mould damage assessment.',
};

export default function InspectionPage() {
  return <ClientInspectionPage />;
}
