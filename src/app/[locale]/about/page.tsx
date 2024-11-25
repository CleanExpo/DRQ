import { aboutMetadata, aboutContent } from './constants'
import { CoreValues } from '@/components/about/CoreValues'
import { ContactSection } from '@/components/about/ContactSection'
import { ServiceAreas } from '@/components/about/ServiceAreas'
import { ExpertiseSection } from '@/components/about/ExpertiseSection'

export const metadata = aboutMetadata

export default function AboutPage() {
  const { hero, commitment, expertise } = aboutContent

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">{hero.title}</h1>
        <p className="text-xl text-gray-600">{hero.description}</p>
      </div>

      {/* Core Values */}
      <CoreValues />

      {/* Company Info */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">{commitment.title}</h2>
          {commitment.content.map((paragraph, index) => (
            <p key={index} className="text-gray-600 mb-4">
              {paragraph}
            </p>
          ))}
        </div>
        <ExpertiseSection 
          title={expertise.title}
          services={expertise.services}
        />
      </div>

      {/* Service Areas */}
      <ServiceAreas />

      {/* Contact Section */}
      <ContactSection />
    </main>
  )
}
