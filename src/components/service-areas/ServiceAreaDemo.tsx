import { ServiceAreaSelector } from './ServiceAreaSelector'
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Info } from "lucide-react"

export function ServiceAreaDemo() {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Service Area Information</AlertTitle>
        <AlertDescription>
          View response times and coverage for your area.
        </AlertDescription>
      </Alert>
      <ServiceAreaSelector />
    </div>
  )
}
