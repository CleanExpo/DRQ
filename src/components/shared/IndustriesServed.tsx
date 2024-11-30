import React from 'react'

interface IndustriesServedProps {
  title: string
  industries: string[]
}

export const IndustriesServed = ({ title, industries }: IndustriesServedProps) => {
  return (
    <section className="bg-gray-100 px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {industries.map((industry, index) => (
            <div 
              key={index}
              className="bg-white p-4 rounded-lg shadow text-center font-semibold"
            >
              {industry}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
