"use client"

export function ServiceAreas() {
  return (
    <div className="bg-gray-50 rounded-lg p-8 mb-16">
      <h2 className="text-2xl font-bold mb-6 text-center">Service Areas</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold mb-4">Brisbane Region</h3>
          <ul className="space-y-2 text-gray-600">
            <li>Brisbane CBD</li>
            <li>North Brisbane</li>
            <li>South Brisbane</li>
            <li>East Brisbane</li>
            <li>West Brisbane</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Gold Coast Region</h3>
          <ul className="space-y-2 text-gray-600">
            <li>Gold Coast North</li>
            <li>Gold Coast Central</li>
            <li>Gold Coast South</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
