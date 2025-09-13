import { ServiceHeader } from "@/components/service/service-header"
import { ExpertProfile } from "@/components/service/expert-profile"
import { ServiceDescription } from "@/components/service/service-description"
import { TimeSlots } from "@/components/service/time-slots"
import { ReviewSection } from "@/components/service/review-section"
import { RelatedServices } from "@/components/service/related-services"
import { BookingCard } from "@/components/service/booking-card"

// Mock data - in real app this would come from API/database
const serviceData = {
  id: "1",
  title: "Advanced Digital Marketing Strategy Consultation",
  category: "Digital Marketing",
  price: 150,
  duration: "2 hours",
  expert: {
    name: "Sarah Johnson",
    title: "Senior Digital Marketing Strategist",
    avatar: "/professional-marketing-expert.png",
    rating: 4.9,
    totalReviews: 127,
    experience: "8+ years",
    completedProjects: 250,
    responseTime: "< 2 hours",
  },
  description: `Transform your business with a comprehensive digital marketing strategy tailored specifically for your industry and goals. This consultation includes:

• In-depth analysis of your current digital presence
• Competitor research and market positioning
• Custom marketing funnel design
• Social media strategy and content planning
• SEO optimization recommendations
• Paid advertising strategy (Google Ads, Facebook, LinkedIn)
• Performance tracking and KPI setup
• 30-day action plan with prioritized tasks

Perfect for businesses looking to scale their online presence, increase lead generation, and maximize ROI from digital marketing efforts.`,
  features: [
    "Personalized strategy document",
    "Competitor analysis report",
    "Custom marketing funnel",
    "30-day implementation roadmap",
    "1 week follow-up support",
  ],
  availability: {
    monday: ["09:00-12:00", "14:00-17:00"],
    tuesday: ["09:00-12:00", "14:00-17:00"],
    wednesday: ["09:00-12:00"],
    thursday: ["09:00-12:00", "14:00-17:00"],
    friday: ["09:00-12:00", "14:00-16:00"],
    saturday: [],
    sunday: [],
  },
}

const reviews = [
  {
    id: 1,
    name: "Michael Chen",
    avatar: "/professional-man.png",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Sarah provided exceptional insights that transformed our marketing approach. The strategy document was comprehensive and the follow-up support was invaluable.",
  },
  {
    id: 2,
    name: "Emily Rodriguez",
    avatar: "/professional-woman-diverse.png",
    rating: 5,
    date: "1 month ago",
    comment:
      "Outstanding consultation! Sarah identified gaps in our funnel that we never noticed. Our conversion rate improved by 40% after implementing her recommendations.",
  },
  {
    id: 3,
    name: "David Thompson",
    avatar: "/confident-businessman.png",
    rating: 4,
    date: "2 months ago",
    comment:
      "Very knowledgeable and professional. The competitor analysis was particularly helpful. Would definitely recommend to other business owners.",
  },
]

export default function ServiceDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Service Header Banner */}
      <ServiceHeader title={serviceData.title} category={serviceData.category} expert={serviceData.expert} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Expert Profile */}
            <ExpertProfile expert={serviceData.expert} />

            {/* Service Description */}
            <ServiceDescription description={serviceData.description} features={serviceData.features} />

            {/* Available Time Slots */}
            <TimeSlots availability={serviceData.availability} />

            {/* Reviews Section */}
            <ReviewSection reviews={reviews} />
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingCard price={serviceData.price} duration={serviceData.duration} expert={serviceData.expert} />
            </div>
          </div>
        </div>

        {/* Related Services */}
        <div className="mt-16">
          <RelatedServices currentServiceId={serviceData.id} />
        </div>
      </div>
    </div>
  )
}
