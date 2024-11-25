import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ServiceLoading() {
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

      {/* Service Features Loading */}
      <div className="mb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 text-center">
                <Skeleton className="h-8 w-8 rounded-full mx-auto mb-2" />
                <Skeleton className="h-5 w-32 mx-auto mb-1" />
                <Skeleton className="h-4 w-full mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Service Stats Loading */}
      <div className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-lg p-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-8 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Service List Loading */}
      <div className="mb-16">
        <Skeleton className="h-8 w-64 mx-auto mb-8" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
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
    </div>
  )
}
