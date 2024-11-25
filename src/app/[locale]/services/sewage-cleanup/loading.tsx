import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SewageCleanupLoading() {
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

      {/* Emergency Banner Loading */}
      <Card className="mb-12">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Skeleton className="h-12 w-32" />
        </CardContent>
      </Card>

      {/* Services Grid Loading */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-12 w-12 rounded-full mb-4" />
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Process Section Loading */}
      <div className="mb-16">
        <Skeleton className="h-8 w-64 mx-auto mb-8" />
        <div className="max-w-3xl mx-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 mb-6">
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
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
