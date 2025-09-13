import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, DollarSign, MessageSquare } from "lucide-react"

interface BookingCardProps {
  price: number
  duration: string
  expert: {
    name: string
    responseTime: string
  }
}

export function BookingCard({ price, duration, expert }: BookingCardProps) {
  return (
    <Card className="bg-card border-primary/20 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-card-foreground">Book This Service</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-card-foreground">Price</span>
            </div>
            <span className="text-2xl font-bold text-primary">${price}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-card-foreground">Duration</span>
            </div>
            <Badge variant="outline" className="bg-primary text-primary-foreground border-primary">
              {duration}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="text-card-foreground">Response</span>
            </div>
            <span className="text-card-foreground font-medium">{expert.responseTime}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
            <Calendar className="h-5 w-5 mr-2" />
            Book Now
          </Button>

          <Button
            variant="outline"
            className="w-full border-primary/20 text-primary hover:bg-primary/5 bg-transparent"
            size="lg"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Message {expert.name.split(" ")[0]}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">Secure payment • Money-back guarantee</p>
        </div>

        <div className="bg-muted p-4 rounded-lg border border-border">
          <h4 className="font-semibold text-card-foreground mb-2">What happens next?</h4>
          <ul className="text-sm text-card-foreground space-y-1">
            <li>• Choose your preferred time slot</li>
            <li>• Complete secure payment</li>
            <li>• Receive confirmation & meeting details</li>
            <li>• Get ready for your consultation!</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
