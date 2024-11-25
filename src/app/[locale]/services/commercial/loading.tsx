import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CommercialLoading() {
  return (
    <div className="container mx-auto px-4 py-12 animate-pulse">
      {/* Hero Section Loading */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
        <div className="flex justify-center">
          <Skeleton className="h-12 w-40" />
        </div>
      </div>

      {/* Industries Grid Loading */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-12 w-12 rounded-full mb-4" />
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Skeleton className="h-1.5 w-1.5 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Section Loading */}
      <div className="mt-16">
        <Skeleton className="h-8 w-64 mx-auto mb-8" />
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6 text-center">
                <Skeleton className="h-6 w-48 mx-auto mb-2" />
                <Skeleton className="h-4 w-full mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

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
