import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface ServiceDescriptionProps {
  description: string
  features: string[]
}

export function ServiceDescription({ description, features }: ServiceDescriptionProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl text-card-foreground">Service Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none">
            {description.split("\n\n").map((paragraph, index) => (
              <p key={index} className="text-card-foreground leading-relaxed mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl text-card-foreground">What's Included</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-card-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
