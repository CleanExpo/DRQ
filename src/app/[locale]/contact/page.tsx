'use client';

// Previous imports remain the same...

export default function ContactPage() {
  // Previous state and handlers remain the same...

  return (
    <div className="min-h-screen">
      {/* Emergency Banner */}
      <div className="bg-red-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span className="font-bold">Need Emergency Assistance?</span>
            <a 
              href="tel:1300309361"
              className="ml-4 bg-white text-red-600 px-4 py-1 rounded-full font-bold hover:bg-red-50 transition-colors"
              aria-label="Call emergency number 1300 309 361"
            >
              Call 1300 309 361
            </a>
          </div>
        </div>
      </div>

      {/* Contact Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
            <form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              aria-label="Contact form"
            >
              <div>
                <label 
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                  aria-label="Full name"
                  aria-required="true"
                />
              </div>

              <div>
                <label 
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email address"
                  aria-label="Email address"
                  aria-required="true"
                />
              </div>

              <div>
                <label 
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your phone number"
                  aria-label="Phone number"
                  aria-required="true"
                />
              </div>

              <div>
                <label 
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your suburb or postcode"
                  aria-label="Location"
                  aria-required="true"
                />
              </div>

              <div>
                <label 
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please describe your situation"
                  aria-label="Message"
                  aria-required="true"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emergency"
                  checked={formData.emergency}
                  onChange={(e) => setFormData({ ...formData, emergency: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  aria-label="Mark as emergency"
                />
                <label 
                  htmlFor="emergency" 
                  className="ml-2 text-sm text-gray-700"
                >
                  This is an emergency requiring immediate response
                </label>
              </div>

              {error && (
                <div 
                  className="text-red-600 text-sm" 
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </div>
              )}

              {submitted && (
                <div 
                  className="text-green-600 text-sm" 
                  role="alert"
                  aria-live="polite"
                >
                  Thank you for your message. We'll be in touch shortly.
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-white font-medium ${
                  submitting 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
                aria-label={submitting ? 'Sending message...' : 'Send message'}
              >
                {submitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" aria-hidden="true" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <a 
                      href="tel:1300309361"
                      className="text-blue-600 hover:text-blue-800"
                      aria-label="Call 1300 309 361"
                    >
                      1300 309 361
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                      24/7 Emergency Response
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <a 
                      href="mailto:admin@disasterrecoveryqld.au"
                      className="text-blue-600 hover:text-blue-800"
                      aria-label="Email admin@disasterrecoveryqld.au"
                    >
                      admin@disasterrecoveryqld.au
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-medium text-gray-900">Office Hours</h3>
                    <ul 
                      className="space-y-1 mt-1"
                      aria-label="Office hours"
                    >
                      {OFFICE_HOURS.map((schedule, index) => (
                        <li 
                          key={index}
                          className="text-sm text-gray-600 flex justify-between"
                        >
                          <span>{schedule.day}</span>
                          <span className="ml-4">{schedule.hours}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Areas */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Areas</h2>
              <div className="space-y-4 mb-6">
                {SERVICE_REGIONS.map(region => (
                  <div 
                    key={region.id}
                    className="flex items-start"
                  >
                    <MapPin className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h3 className="font-medium text-gray-900">{region.name}</h3>
                      <p className="text-sm text-gray-600">
                        Response Time: {region.responseTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div 
        className="h-[400px] mt-12"
        aria-label="Service areas map"
      >
        <RegionMap
          center={{ lat: -27.4698, lng: 153.0251 }}
          radius={100}
          markers={SERVICE_REGIONS.map(region => ({
            position: region.coordinates,
            title: region.name,
            type: 'office'
          }))}
          zoom={8}
        />
      </div>
    </div>
  );
}
