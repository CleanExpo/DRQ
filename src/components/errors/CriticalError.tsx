import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Phone } from "lucide-react"

interface ErrorProps {
  title?: string
  description?: string
  showEmergencyContact?: boolean
}

export function CriticalError({ 
  title = "Something went wrong",
  description = "We're unable to process your request at the moment.",
  showEmergencyContact = true 
}: ErrorProps) {
  return (
    <div className="p-4">
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>

      {showEmergencyContact && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            For immediate assistance, please call:
          </p>
          <Button variant="default" size="lg" className="gap-2">
            <Phone className="h-4 w-4" />
            1300 309 361
          </Button>
        </div>
      )}
    </div>
  )
}

// Error boundaries for critical sections
export function ServiceAreaErrorBoundary() {
  return (
    <CriticalError
      title="Unable to load service area information"
      description="Please contact us directly to check service availability."
    />
  )
}

export function EmergencyContactErrorBoundary() {
  return (
    <CriticalError
      title="Emergency Contact Unavailable"
      description="Please call 1300 309 361 directly for immediate assistance."
      showEmergencyContact={true}
    />
  )
}

export function LocationErrorBoundary() {
  return (
    <CriticalError
      title="Location Information Unavailable"
      description="We're having trouble loading location information. Please try again or contact us directly."
    />
  )
}

export function ServiceErrorBoundary() {
  return (
    <CriticalError
      title="Service Information Unavailable"
      description="We're having trouble loading service information. Please try again or contact us directly for immediate assistance."
    />
  )
}

export function FormErrorBoundary() {
  return (
    <CriticalError
      title="Form Submission Error"
      description="We're unable to process your request at the moment. Please try again or contact us directly."
      showEmergencyContact={true}
    />
  )
}
