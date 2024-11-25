import { LoadingSpinner } from "@/components/loading/RouteLoading"

export default function RootLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner className="mb-4" />
        <p className="text-sm text-gray-500 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  )
}
