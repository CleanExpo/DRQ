"use client"

interface ExpertiseSectionProps {
  title: string
  services: string[]
}

export function ExpertiseSection({ title, services }: ExpertiseSectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <ul className="space-y-4">
        {services.map((service, index) => (
          <li key={index} className="flex items-center gap-3">
            <div className="h-2 w-2 bg-blue-500 rounded-full" />
            <span>{service}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
