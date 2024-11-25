import { ErrorBoundary } from '@/components/errors/ErrorBoundary'
import { PageTemplate } from '@/app/[locale]/template'
import { ServiceAreaSelector } from '@/components/service-areas'
import { Card } from '@/components/ui/card'

export function AboutTemplate() {
  return (
    <PageTemplate
      heading="About Us"
      subheading="Professional disaster recovery services you can trust"
      breadcrumbs={[{ label: 'About', href: '/about' }]}
      params={{ locale: 'en-AU' }} // This should be passed from the page component
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ErrorBoundary>
            <div className="prose prose-lg max-w-none">
              <Card className="p-6">
                <h2>Our Story</h2>
                <p>
                  With over a decade of experience in disaster recovery and restoration 
                  services, we've built a reputation for rapid response and professional 
                  service across South East Queensland.
                </p>

                <h2>Our Commitment</h2>
                <p>
                  We understand that disasters don't wait for business hours. That's why 
                  our team is available 24/7, ready to respond to emergencies across 
                  Brisbane and the Gold Coast region.
                </p>

                <h2>Professional Expertise</h2>
                <p>
                  Our technicians are highly trained and certified in water damage 
                  restoration, fire damage recovery, and mould remediation. We use the 
                  latest equipment and techniques to ensure the best possible outcomes 
                  for your property.
                </p>

                <h2>Local Knowledge</h2>
                <p>
                  As a Queensland-based company, we understand the unique challenges of 
                  our climate and environment. This local knowledge helps us provide more 
                  effective solutions for our clients.
                </p>
              </Card>
            </div>
          </ErrorBoundary>
        </div>
        
        <div className="space-y-6">
          <ErrorBoundary>
            <ServiceAreaSelector />
          </ErrorBoundary>
        </div>
      </div>
    </PageTemplate>
  )
}
