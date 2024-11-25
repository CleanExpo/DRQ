import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ServiceArea as ServiceAreaType } from "@/types/serviceTypes"
import { cn } from "@/lib/utils"

interface ServiceAreaProps {
  areas: ServiceAreaType[];
  selectedArea?: string;
  onSelect?: (value: string) => void;
  className?: string;
}

export function ServiceArea({
  areas,
  selectedArea,
  onSelect,
  className
}: ServiceAreaProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Select Service Area</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedArea} onValueChange={onSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Choose an area" />
          </SelectTrigger>
          <SelectContent>
            {areas.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}
