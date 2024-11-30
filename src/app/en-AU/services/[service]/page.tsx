import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SERVICE_CONTENT } from '../../../../config/content';
import { generateServiceMetadata } from '../../../../lib/metadata';
import ServicePage from '../../../../components/templates/ServicePage';

interface ServicePageProps {
  params: {
    service: string;
  };
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const serviceContent = SERVICE_CONTENT[params.service.toUpperCase()];
  if (!serviceContent) return {};
  return generateServiceMetadata(serviceContent);
}

export default function Service({ params }: ServicePageProps) {
  const serviceContent = SERVICE_CONTENT[params.service.toUpperCase()];
  
  if (!serviceContent) {
    notFound();
  }

  return <ServicePage service={serviceContent} />;
}
