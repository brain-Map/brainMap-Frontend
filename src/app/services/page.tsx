"use client";

import { ExpertCard } from "@/components/ExpertServiceCard";
import axios from "axios";
import { useEffect, useState } from "react";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/domain-experts/service-listings`;

type Availability = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

type Service = {
  title: string;
  subject: string;
  description: string;
  fee: number;
  createdAt: string;
  updatedAt: string;
  mentorId: string;
  availabilities: Availability[];
  serviceId: string;
};

export function useServiceListings() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(BACKEND_URL)
      .then((res) => {
        setServices(res.data.content || []);
      })
      .catch(() => {
        setServices([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { services, loading };
}

const sampleMentors = {
  "7b06b1e7-5c3f-4b14-84d7-99b70ccffaa3": {
    name: "Dr. Alex Johnson",
    avatar: "/professional-man-software-developer.png",
    rating: 4.8,
    reviewCount: 156,
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
};

export default function Home() {
  const { services, loading } = useServiceListings();

  return (
    <div className="min-h-screen bg-background p-6 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Find Your Expert
          </h1>
          <p className="text-xl text-muted-foreground">
            Connect with professionals who can help you achieve your goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ExpertCard
              key={service.serviceId}
              service={service}
              mentor={
                sampleMentors[service.mentorId as keyof typeof sampleMentors]
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
