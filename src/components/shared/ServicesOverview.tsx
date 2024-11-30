import React from 'react'

interface Service {
  title: string
  description: string
  icon?: string
}

interface ServicesOverviewProps {
  title: string
  services: Service[]
  columns?: 3 | 4
}

export const ServicesOverview = ({ 
  title, 
  services,
  columns = 3
}: ServicesOverviewProps) => {
  return (
    <section className="px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-8`}>
        {services.map((service, index) => (
          <div 
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            {service.icon && (
              <div className="text-4xl mb-4">{service.icon}</div>
            )}
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
