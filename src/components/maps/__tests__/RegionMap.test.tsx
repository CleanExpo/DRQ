import { render, screen, act } from '@testing-library/react';
import RegionMap from '../RegionMap';

// Mock Google Maps API
const mockMap = {
  setCenter: jest.fn(),
  setZoom: jest.fn(),
  setOptions: jest.fn()
};

const mockCircle = {
  setMap: jest.fn(),
  setRadius: jest.fn(),
  setCenter: jest.fn()
};

const mockMarker = {
  setMap: jest.fn(),
  setPosition: jest.fn(),
  setTitle: jest.fn(),
  setIcon: jest.fn()
};

// Mock Google Maps Loader
jest.mock('@googlemaps/js-api-loader', () => ({
  Loader: jest.fn().mockImplementation(() => ({
    load: () => Promise.resolve({
      Map: jest.fn().mockImplementation(() => mockMap),
      Circle: jest.fn().mockImplementation(() => mockCircle),
      Marker: jest.fn().mockImplementation(() => mockMarker),
      SymbolPath: {
        CIRCLE: 'CIRCLE'
      }
    })
  }))
}));

describe('RegionMap', () => {
  const defaultProps = {
    center: { lat: -27.4698, lng: 153.0251 },
    radius: 30,
    markers: [
      {
        position: { lat: -27.4698, lng: 153.0251 },
        title: 'Brisbane Office',
        type: 'office' as const
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render map container', () => {
    render(<RegionMap {...defaultProps} />);
    expect(screen.getByTestId('region-map')).toBeInTheDocument();
  });

  it('should initialize map with correct options', async () => {
    await act(async () => {
      render(<RegionMap {...defaultProps} />);
    });

    expect(mockMap.setOptions).toHaveBeenCalledWith(
      expect.objectContaining({
        center: defaultProps.center,
        zoom: 11,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      })
    );
  });

  it('should create coverage circle with correct options', async () => {
    await act(async () => {
      render(<RegionMap {...defaultProps} />);
    });

    expect(mockCircle).toHaveBeenCalledWith(
      expect.objectContaining({
        center: defaultProps.center,
        radius: defaultProps.radius * 1000,
        strokeColor: '#1E40AF',
        fillColor: '#3B82F6'
      })
    );
  });

  it('should create markers with correct options', async () => {
    await act(async () => {
      render(<RegionMap {...defaultProps} />);
    });

    expect(mockMarker).toHaveBeenCalledWith(
      expect.objectContaining({
        position: defaultProps.markers[0].position,
        title: defaultProps.markers[0].title,
        icon: expect.objectContaining({
          fillColor: '#1E40AF', // Office marker color
          scale: 10
        })
      })
    );
  });

  it('should update circle radius when prop changes', async () => {
    const { rerender } = render(<RegionMap {...defaultProps} />);
    
    await act(async () => {
      rerender(<RegionMap {...defaultProps} radius={40} />);
    });

    expect(mockCircle.setRadius).toHaveBeenCalledWith(40000);
  });

  it('should handle multiple markers', async () => {
    const multipleMarkers = {
      ...defaultProps,
      markers: [
        {
          position: { lat: -27.4698, lng: 153.0251 },
          title: 'Brisbane Office',
          type: 'office' as const
        },
        {
          position: { lat: -27.4800, lng: 153.0300 },
          title: 'Emergency Site',
          type: 'emergency' as const
        }
      ]
    };

    await act(async () => {
      render(<RegionMap {...multipleMarkers} />);
    });

    expect(mockMarker).toHaveBeenCalledTimes(2);
    expect(mockMarker).toHaveBeenCalledWith(
      expect.objectContaining({
        position: multipleMarkers.markers[1].position,
        title: multipleMarkers.markers[1].title,
        icon: expect.objectContaining({
          fillColor: '#DC2626' // Emergency marker color
        })
      })
    );
  });

  it('should cleanup markers and circle on unmount', async () => {
    const { unmount } = render(<RegionMap {...defaultProps} />);
    
    await act(async () => {
      unmount();
    });

    expect(mockMarker.setMap).toHaveBeenCalledWith(null);
    expect(mockCircle.setMap).toHaveBeenCalledWith(null);
  });

  it('should handle custom zoom level', async () => {
    await act(async () => {
      render(<RegionMap {...defaultProps} zoom={15} />);
    });

    expect(mockMap.setOptions).toHaveBeenCalledWith(
      expect.objectContaining({
        zoom: 15
      })
    );
  });

  describe('Error Handling', () => {
    it('should handle missing Google Maps API key', async () => {
      const originalEnv = process.env;
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = '';

      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      await act(async () => {
        render(<RegionMap {...defaultProps} />);
      });

      expect(consoleError).toHaveBeenCalled();

      process.env = originalEnv;
      consoleError.mockRestore();
    });

    it('should handle Google Maps load failure', async () => {
      const mockLoader = require('@googlemaps/js-api-loader').Loader;
      mockLoader.mockImplementationOnce(() => ({
        load: () => Promise.reject(new Error('Failed to load Google Maps'))
      }));

      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      await act(async () => {
        render(<RegionMap {...defaultProps} />);
      });

      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      await act(async () => {
        render(<RegionMap {...defaultProps} />);
      });

      const mapContainer = screen.getByTestId('region-map');
      expect(mapContainer).toHaveAttribute('role', 'region');
      expect(mapContainer).toHaveAttribute('aria-label', 'Service area map');
    });
  });
});
