import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

interface Review {
  id: number
  name: string
  avatar: string
  rating: number
  date: string
  comment: string
}

interface ReviewSectionProps {
  reviews: Review[]
}

export function ReviewSection({ reviews }: ReviewSectionProps) {
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  return (
    <Card className="bg-card border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl text-card-foreground">Client Reviews ({reviews.length})</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${star <= averageRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="font-semibold text-card-foreground">{averageRating.toFixed(1)} out of 5</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-primary/10 last:border-b-0 pb-6 last:pb-0">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {review.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-card-foreground">{review.name}</h4>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-card-foreground leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
