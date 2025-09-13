import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Star, Clock, CheckCircle, MessageCircle } from "lucide-react"

interface ExpertProfileProps {
  expert: {
    name: string
    title: string
    avatar: string
    rating: number
    totalReviews: number
    experience: string
    completedProjects: number
    responseTime: string
  }
}

export function ExpertProfile({ expert }: ExpertProfileProps) {
  return (
    <Card className="bg-card border-primary/20">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24 border-2 border-primary/20">
              <AvatarImage src={expert.avatar || "/placeholder.svg"} alt={expert.name} />
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {expert.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-card-foreground mb-1">{expert.name}</h2>
              <p className="text-muted-foreground text-lg">{expert.title}</p>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-card-foreground">{expert.rating}</span>
                <span className="text-muted-foreground">({expert.totalReviews} reviews)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-semibold text-card-foreground">{expert.experience}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Projects Completed</p>
                  <p className="font-semibold text-card-foreground">{expert.completedProjects}+</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Response Time</p>
                  <p className="font-semibold text-card-foreground">{expert.responseTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
