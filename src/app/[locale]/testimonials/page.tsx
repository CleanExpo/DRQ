'use client';

// Previous imports remain the same...

export default function TestimonialsPage() {
  const [selectedService, setSelectedService] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Previous filter logic and handlers remain the same...

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Client Testimonials
          </h1>
          <p className="text-xl text-white/90">
            Read what our clients say about our services
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center text-gray-600 mb-4"
            aria-expanded={showFilters ? 'true' : 'false'}
            aria-controls="filter-options"
          >
            <Filter className="w-5 h-5 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          <div 
            id="filter-options"
            className={`space-y-4 md:space-y-0 md:flex md:items-center md:gap-6 ${
              showFilters ? 'block' : 'hidden md:flex'
            }`}
          >
            {/* Service Filter */}
            <div>
              <label 
                htmlFor="service-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Service Type
              </label>
              <select
                id="service-filter"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Filter by service type"
              >
                {SERVICES.map(service => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label 
                htmlFor="location-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <select
                id="location-filter"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Filter by location"
              >
                {LOCATIONS.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-4 py-12">
        <div 
          className="space-y-8"
          role="feed"
          aria-label="Client testimonials"
        >
          {filteredTestimonials.map(testimonial => (
            <article
              key={testimonial.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start gap-4">
                {/* Client Image */}
                {testimonial.imageUrl && (
                  <div className="flex-shrink-0">
                    <Image
                      src={testimonial.imageUrl}
                      alt={testimonial.clientName}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  </div>
                )}

                {/* Review Content */}
                <div className="flex-grow">
                  {/* Client Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="font-bold text-gray-900">
                      {testimonial.clientName}
                    </h2>
                    {testimonial.verified && (
                      <span 
                        className="inline-flex items-center text-green-600"
                        title="Verified Review"
                        aria-label="Verified review"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="flex" 
                      aria-label={`Rating: ${testimonial.rating} out of 5 stars`}
                    >
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>

                  {/* Review */}
                  <p className="text-gray-600 mb-4">
                    {testimonial.review}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" aria-hidden="true" />
                      {testimonial.location}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" aria-hidden="true" />
                      {formatDate(testimonial.date)}
                    </span>
                    <span className="text-blue-600">
                      {testimonial.service}
                    </span>
                  </div>

                  {/* Response */}
                  {testimonial.response && (
                    <div 
                      className="mt-4 pl-4 border-l-4 border-blue-200"
                      role="complementary"
                      aria-label="Company response"
                    >
                      <p className="text-gray-600 mb-1">
                        {testimonial.response.text}
                      </p>
                      <p className="text-sm text-gray-500">
                        Responded on {formatDate(testimonial.response.date)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}

          {filteredTestimonials.length === 0 && (
            <div 
              className="text-center py-12"
              role="status"
              aria-live="polite"
            >
              <p className="text-gray-600">
                No testimonials found matching your filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
