import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Property Inspection Report | DRQ',
  description: 'Create detailed property inspection reports following IICRC standards for water, fire, and mould damage assessment.',
};

export default function InspectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-50">
      {children}
    </main>
  );
}
