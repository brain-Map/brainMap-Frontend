'use client';

import React from 'react';
import { MentorPublicProfile, Service } from '@/types/mentor';
// import { ServiceCard } from './ServiceCard';
import { ServiceCard } from "@/components/services/ServiceCard"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MentorServicesProps {
  services: Service[];
  onBookService?: (serviceId: string) => void;
}

export const MentorServices: React.FC<MentorServicesProps> = ({ services, onBookService }) => {
  if (!services || services.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No services offered yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Services Offered ({services.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.serviceId} service={service} onBook={onBookService} />
          ))}
        </div>
      </div>
    </div>
  );
};
