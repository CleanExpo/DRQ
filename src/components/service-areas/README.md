# Service Area Components

## Components
- ServiceAreaSelector: Main component for area selection and info display
- ServiceArea: Base component for area selection
- ServiceRadiusSimple: Visualization of service coverage

## Usage
```tsx
import { ServiceAreaSelector } from 'components/service-areas'

export default function ServiceAreaPage() {
  return (
    <div className="container mx-auto p-4">
      <ServiceAreaSelector />
    </div>
  )
}
```

## Features

- Area selection with search functionality
- Coverage zone visualization
- Emergency response information
- Suburb filtering
- Smooth animations

## Next Steps

- Landing page integration
- Emergency service connection
- Real-time availability updates

## Dependencies

- shadcn/ui components
- framer-motion for animations

## Implementation Details

The service area components provide a comprehensive solution for:
- Searching and selecting service areas
- Visualizing coverage zones
- Displaying emergency response information
- Filtering suburbs
- Smooth transitions and animations

### Key Features

1. **Search Functionality**
   - Real-time suburb filtering
   - Instant results display
   - Case-insensitive search

2. **Coverage Visualization**
   - Priority zones
   - Standard coverage areas
   - Extended service regions
   - Response time indicators

3. **Animations**
   - Smooth transitions between states
   - Fade effects for content changes
   - Motion feedback for interactions

4. **Emergency Information**
   - Response time estimates
   - Service availability status
   - Contact information
   - Priority level indicators
