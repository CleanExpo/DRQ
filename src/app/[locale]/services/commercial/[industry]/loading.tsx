import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function IndustryLoading() {
  return (
    <div className="container mx-auto px-4 py-12 animate-pulse">
      {/* Hero Section Loading */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>

      {/* Features Section Loading */}
      <div className="mb-16">
        <Skeleton className="h-8 w-64 mx-auto mb-8" />
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-5 w-5 rounded mt-1" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Service Area Section Loading */}
      <div className="mb-16">
        <Skeleton className="h-8 w-64 mx-auto mb-8" />
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-32" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section Loading */}
      <Card>
        <CardContent className="p-8 text-center">
          <Skeleton className="h-8 w-96 mx-auto mb-4" />
          <Skeleton className="h-4 w-64 mx-auto mb-6" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-40" />
          </div>
        </CardContent>
      </Card>

      {/* Fixed Emergency Contact Loading */}
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="text-center">
              <Skeleton className="h-4 w-40 mx-auto mb-2" />
              <Skeleton className="h-12 w-40 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
