import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface RelatedServicesProps {
  currentServiceId: string
}

// Mock related services data
const relatedServices = [
  {
    id: "2",
    title: "Social Media Content Strategy",
    category: "Social Media",
    price: 120,
    expert: {
      name: "Alex Rivera",
      avatar: "/social-media-expert.png",
      rating: 4.8,
      totalReviews: 89,
    },
  },
  {
    id: "3",
    title: "SEO Audit & Optimization",
    category: "SEO",
    price: 200,
    expert: {
      name: "Maria Santos",
      avatar: "/seo-expert-woman.jpg",
      rating: 4.9,
      totalReviews: 156,
    },
  },
  {
    id: "4",
    title: "Google Ads Campaign Setup",
    category: "Paid Advertising",
    price: 180,
    expert: {
      name: "James Wilson",
      avatar: "/ads-expert-man.jpg",
      rating: 4.7,
      totalReviews: 203,
    },
  },
]

export function RelatedServices({ currentServiceId }: RelatedServicesProps) {
  return (
    <Card className="bg-card border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl text-card-foreground">Related Services</CardTitle>
        <p className="text-muted-foreground">Other services that complement your digital marketing strategy</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedServices.map((service) => (
            <div key={service.id} className="group">
              <Card className="h-full bg-background border-primary/10 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Badge variant="default" className="bg-primary text-primary-foreground border-primary mb-3">
                        {service.category}
                      </Badge>
                      <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={service.expert.avatar || "/placeholder.svg"} alt={service.expert.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {service.expert.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{service.expert.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs text-muted-foreground">
                            {service.expert.rating} ({service.expert.totalReviews})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">${service.price}</span>
                      <Link href={`/service/${service.id}`}>
                        <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                          View Details
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
