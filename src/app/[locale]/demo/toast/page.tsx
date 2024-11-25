"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function ToastDemo() {
  const { toast } = useToast()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Toast Demo</h1>
      <div className="flex gap-4">
        <Button
          onClick={() => {
            toast({
              title: "Success",
              description: "Your action was completed successfully.",
            })
          }}
        >
          Show Success Toast
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Something went wrong.",
            })
          }}
        >
          Show Error Toast
        </Button>
      </div>
    </div>
  )
}
