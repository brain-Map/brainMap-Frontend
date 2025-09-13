import { Badge } from "@/components/ui/badge"
import { Star, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ServiceHeaderProps {
  title: string
  category: string
  expert: {
    name: string
    rating: number
    totalReviews: number
  }
}

export function ServiceHeader({ title, category, expert }: ServiceHeaderProps) {
  return (
    <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 border-b border-primary/20">
      <div className="absolute inset-0 bg-[url('/professional-consultation-background.jpg')] bg-cover bg-center opacity-10" />

      <div className="relative container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/services">
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl">
          <Badge variant="secondary" className="mb-4 bg-primary text-primary-foreground border-primary">
            {category}
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">{title}</h1>

          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="text-lg">by {expert.name}</span>
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">{expert.rating}</span>
              <span>({expert.totalReviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
