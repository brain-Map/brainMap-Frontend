import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Star, MapPin, Calendar, Target, User } from "lucide-react";

interface ExpertCardProps {
  service: {
    title: string;
    subject: string;
    description: string;
    fee: number;
    serviceId: string;
    mentorId: string;
    availabilities: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }[];
  };
  // Optional mentor info - in real app this would come from mentor API
  mentor?: {
    name: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
  };
}

const getDayName = (dayOfWeek: number): string => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayOfWeek] || "Unknown";
};

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour = Number.parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export function ExpertCard({ service, mentor }: ExpertCardProps) {
  const availableDays = service.availabilities.map((availability) => ({
    day: getDayName(availability.dayOfWeek),
    startTime: formatTime(availability.startTime),
    endTime: formatTime(availability.endTime),
  }));

  const defaultMentor = {
    name: "Expert Mentor",
    avatar: undefined,
    rating: 4.8,
    reviewCount: 127,
    location: "Remote",
    yearsExperience: 5,
    clientsServed: 200,
  };

  const mentorData = mentor || defaultMentor;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md bg-white overflow-hidden max-w-md">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-start justify-between mb-2">
            <h2 className="font-bold text-xl leading-tight flex-1 pr-4">
              {service.subject}
            </h2>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1 font-bold text-2xl">
                <DollarSign className="h-6 w-6" />
                {service.fee}
              </div>
              <p className="text-blue-100 text-sm">per hour</p>
            </div>
          </div>
          <p className="text-blue-100 text-base font-medium">{service.title}</p>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-blue-100">
              {mentorData.avatar ? (
                <img
                  src={mentorData.avatar || "/placeholder.svg"}
                  alt={mentorData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">
                {mentorData.name}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-gray-900">
                    {mentorData.rating}
                  </span>
                  <span>({mentorData.reviewCount})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                What You'll Learn
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              Weekly Availability
            </h4>
            <div className="space-y-2">
              {availableDays.map((schedule, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border bg-green-50 border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="font-medium text-gray-900 text-sm min-w-[60px]">
                      {schedule.day}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-green-700">
                      {schedule.startTime} - {schedule.endTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base transition-colors shadow-sm"
            size="lg"
          >
            Book {service.subject} Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
