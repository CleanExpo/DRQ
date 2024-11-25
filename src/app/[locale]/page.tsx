import { Metadata } from 'next'
import { Hero } from '@/components/sections/Hero'
import { EmergencyCallout } from '@/components/sections/EmergencyCallout'
import { ServicesOverview } from '@/components/sections/ServicesOverview'
import { LocationsOverview } from '@/components/sections/LocationsOverview'

export const metadata: Metadata = {
  title: 'Disaster Recovery QLD - 24/7 Emergency Restoration Services',
  description: 'Professional restoration services for water damage, fire damage, and mould remediation. Fast response times across Brisbane and Gold Coast.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <EmergencyCallout />
      <ServicesOverview />
      <LocationsOverview />
    </>
  )
}
