import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface TimeSlotsProps {
  availability: {
    [key: string]: string[]
  }
}

const dayNames = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
}

export function TimeSlots({ availability }: TimeSlotsProps) {
  return (
    <Card className="bg-card border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-card-foreground">
          <Clock className="h-5 w-5 text-primary" />
          Available Time Slots
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(availability).map(([day, slots]) => (
            <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-24 font-medium text-card-foreground">{dayNames[day as keyof typeof dayNames]}</div>
              <div className="flex-1">
                {slots.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {slots.map((slot, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10"
                      >
                        {slot}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">Not available</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-card-foreground">
            <strong>Note:</strong> All times are in your local timezone. You can select your preferred time slot during
            the booking process.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
