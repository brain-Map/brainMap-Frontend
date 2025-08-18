import { ExpertCard } from "@/components/ExpertServiceCard"

const sampleServices = [
  {
    title: "Project Management",
    subject: "Software Engineering",
    description: "I'm expert in PM, project analyze and create pattern for project development",
    fee: 100.0,
    serviceId: "4016f2e5-67c1-484a-9e87-8b494f5ad59e",
    mentorId: "7b06b1e7-5c3f-4b14-84d7-99b70ccffaa3",
    availabilities: [
      {
        dayOfWeek: 6,
        startTime: "20:00:00",
        endTime: "00:00:00",
      },
      {
        dayOfWeek: 0,
        startTime: "20:00:00",
        endTime: "00:00:00",
      },
    ],
  },
  {
    title: "Quantum Physics",
    subject: "Physics",
    description: "All about quantum physics and advanced theoretical concepts",
    fee: 55.0,
    serviceId: "f62f0179-f586-4309-a477-1b4fa3d0a1a3",
    mentorId: "7b06b1e7-5c3f-4b14-84d7-99b70ccffaa3",
    availabilities: [
      {
        dayOfWeek: 1,
        startTime: "10:00:00",
        endTime: "12:00:00",
      },
      {
        dayOfWeek: 3,
        startTime: "10:00:00",
        endTime: "12:00:00",
      },
    ],
  },
  {
    title: "Machine Learning & AI",
    subject: "Data Science",
    description:
      "Specialized in developing end-to-end machine learning solutions for Fortune 500 companies. Expert in deep learning, natural language processing, and computer vision.",
    fee: 150.0,
    serviceId: "ml-ai-service-001",
    mentorId: "mentor-sarah-chen",
    availabilities: [
      {
        dayOfWeek: 1,
        startTime: "09:00:00",
        endTime: "17:00:00",
      },
      {
        dayOfWeek: 2,
        startTime: "10:00:00",
        endTime: "16:00:00",
      },
      {
        dayOfWeek: 3,
        startTime: "09:00:00",
        endTime: "17:00:00",
      },
      {
        dayOfWeek: 4,
        startTime: "10:00:00",
        endTime: "18:00:00",
      },
      {
        dayOfWeek: 5,
        startTime: "09:00:00",
        endTime: "15:00:00",
      },
    ],
  },
]

const sampleMentors = {
  "7b06b1e7-5c3f-4b14-84d7-99b70ccffaa3": {
    name: "Dr. Alex Johnson",
    avatar: "/professional-man-software-developer.png",
    rating: 4.8,
    reviewCount: 156,
    location: "Remote",
    yearsExperience: 8,
    clientsServed: 200,
  },
  "mentor-sarah-chen": {
    name: "Dr. Sarah Chen",
    avatar: "/professional-woman-data-scientist.png",
    rating: 4.9,
    reviewCount: 127,
    location: "San Francisco, CA",
    yearsExperience: 12,
    clientsServed: 85,
  },
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Find Your Expert</h1>
          <p className="text-xl text-muted-foreground">
            Connect with professionals who can help you achieve your goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleServices.map((service) => (
            <ExpertCard
              key={service.serviceId}
              service={service}
              mentor={sampleMentors[service.mentorId as keyof typeof sampleMentors]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
