'use client';

// Previous imports remain the same...

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [showBefore, setShowBefore] = useState(true);

  // Previous filter and handlers remain the same...

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Project Gallery
          </h1>
          <p className="text-xl text-white/90">
            Before and after photos of our restoration projects
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
                aria-pressed={selectedCategory === category ? 'true' : 'false'}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map(image => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedImage(image)}
              role="button"
              aria-label={`View ${image.title}`}
              tabIndex={0}
            >
              <div className="relative h-64">
                <Image
                  src={image.before}
                  alt={`Before: ${image.title}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-xl font-bold text-white mb-1">
                    {image.title}
                  </h2>
                  <p className="text-white/90 text-sm">
                    {image.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No projects found in this category
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`modal-title-${selectedImage.id}`}
        >
          <div className="relative w-full max-w-6xl mx-4">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              aria-label="Close gallery"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Container */}
            <div className="relative aspect-video">
              <Image
                src={showBefore ? selectedImage.before : selectedImage.after}
                alt={`${showBefore ? 'Before' : 'After'}: ${selectedImage.title}`}
                fill
                className="object-cover rounded-lg"
              />
              
              {/* Navigation Buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              {/* Before/After Toggle */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="bg-black/50 rounded-full p-1 flex">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBefore(true);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      showBefore
                        ? 'bg-white text-black'
                        : 'text-white hover:bg-white/10'
                    } transition-colors`}
                    aria-pressed={showBefore ? 'true' : 'false'}
                  >
                    Before
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBefore(false);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      !showBefore
                        ? 'bg-white text-black'
                        : 'text-white hover:bg-white/10'
                    } transition-colors`}
                    aria-pressed={!showBefore ? 'true' : 'false'}
                  >
                    After
                  </button>
                </div>
              </div>
            </div>

            {/* Image Info */}
            <div className="mt-4 text-white">
              <h2 
                id={`modal-title-${selectedImage.id}`}
                className="text-2xl font-bold mb-2"
              >
                {selectedImage.title}
              </h2>
              <p className="text-white/90 mb-2">{selectedImage.description}</p>
              <p className="text-white/80">Location: {selectedImage.location}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
