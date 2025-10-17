import React, { useState, useEffect } from 'react';
import { X, MessageCircle, CreditCard } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

type ServiceStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CONFIRMED' | 'UPDATED';

interface Service {
  id: number;
  serviceId: string;
  serviceSubject: string;
  serviceTitl: string;
  expertFirstName: string;
  expertLastName: string;
  expertEmail: string;
  status: ServiceStatus;
}

interface HiredDetails {
  id: number;
  serviceId: string;
  serviceTitle: string;
  userId: string;
  username: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userAvatar?: string;
  duration: number;
  projectDetails: string;
  bookingMode: 'HOURLY' | 'MONTHLY' | 'PROJECT_BASED';
  // HOURLY
  requestedDate?: string; // YYYY-MM-DD
  requestedStartTime?: string; // HH:mm:ss
  requestedEndTime?: string; // HH:mm:ss
  // MONTHLY
  requestedMonths?: string[]; // ["YYYY-MM"]
  updatedMonths?: string[];
  // PROJECT_BASED
  projectDeadline?: string; // YYYY-MM-DD

  totalPrice: number;
  status: ServiceStatus;
  acceptedDate?: string;
  acceptedTime?: string;
  acceptedPrice?: number;
  createdAt: string;
  updatedAt?: string;

  // Updates
  updatedStartTime?: string;
  updatedEndTime?: string;
  updatedDate?: string;
  updatedPrice?: number;

  // Pricing selection
  selectedPricingId?: string;
  selectedPricingType?: string;
  selectedPricingPrice?: number;
}



const hireingFunctions = {

    getHiredExpertsData: async (userId: string): Promise<Service[]> => {
    try {
      const response = await api.get(`/project-member/projects/hired-expert/${userId}`);
      console.log('User Data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  getBookingService: async (Id: string): Promise<HiredDetails[]> => {
    try {
      const response = await api.get(`/project-member/projects/${Id}/bookings/filter`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking services:', error);
      throw error;
    }
  },

};

const ServiceListTabs: React.FC = () => {
  const user = useAuth().user;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ServiceStatus>('ACCEPTED');
  const [services, setServices] = useState<Service[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<HiredDetails[] | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchHiredExperts = async () => {
      if (!user) return;

      try {
        const experts = await hireingFunctions.getHiredExpertsData(user.id);
        setServices(experts);
      } catch (error) {
        console.error('Error fetching hired experts:', error);
      }
    };

    fetchHiredExperts();
  }, [user]);


  const filteredServices = services.filter(service =>
        service.status === activeTab || (activeTab === 'ACCEPTED' && service.status === 'UPDATED')
  );


  const handleCancel = (id: number) => {
    console.log('Cancel service:', id);
    // Add your cancel logic here
  };

  const handleMessage = (id: number) => {
    console.log('Message for service:', id);
    // Add your message logic here
  };

  const handlePayment = (id: number) => {
    console.log('Payment for service:', id);
    // Redirect to payment gateway checkout page
    router.push('/payment-gateway/checkout');
  };

  const openServiceDetails = async (service: Service) => {
    setSelectedService(service);
    setDetailsOpen(true);
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      const id = service.id || String(service.id);
      console.log('Fetching booking details for service ID:', id);
      const details = await hireingFunctions.getBookingService(id.toString());
      setBookingDetails(details);
      console.log('Fetched booking details:', details);
    } catch (e: any) {
      setDetailsError(e?.response?.data?.message || 'Failed to load booking details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const tabs: { key: ServiceStatus; label: string }[] = [
    { key: 'ACCEPTED', label: 'Accepted' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'REJECTED', label: 'Rejected' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'CONFIRMED', label: 'Confirmed' },
  ];

  return (
    <div className="w-full">

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === tab.key
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Service List */}
      <div className="space-y-3">
        {filteredServices.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No {activeTab} services found
          </div>
        ) : (
          filteredServices.map(service => (
            <div
              key={service.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openServiceDetails(service)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {service.serviceTitl}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Supervisor: {service.expertFirstName} {service.expertLastName} - {service.expertEmail}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {activeTab === 'ACCEPTED' ? (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMessage(service.id); }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <MessageCircle size={18} />
                        Message
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePayment(service.id); }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <CreditCard size={18} />
                        Payment
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCancel(service.id); }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </>
                  ) : activeTab === 'COMPLETED' ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMessage(service.id); }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <MessageCircle size={18} />
                      Message
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMessage(service.id); }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <MessageCircle size={18} />
                        Message
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCancel(service.id); }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              {selectedService ? `${selectedService.serviceTitl} • ${selectedService.expertFirstName} ${selectedService.expertLastName}` : '—'}
            </DialogDescription>
          </DialogHeader>
          {detailsLoading ? (
            <div className="py-10 text-center text-gray-500">Loading...</div>
          ) : detailsError ? (
            <div className="py-6 text-sm text-red-600">{detailsError}</div>
          ) : bookingDetails && bookingDetails.length > 0 ? (
            <div className="space-y-4">
              {bookingDetails.map((b, idx) => (
                <div key={idx} className="rounded-lg border p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-gray-500">Service Title</div>
                      <div className="font-medium">{b.serviceTitle}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Booking Mode</div>
                      <div className="font-medium">{b.bookingMode}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Status</div>
                      <div className="font-medium">{b.status}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Total Price</div>
                      <div className="font-medium">{b.totalPrice}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Requested</div>
                      <div className="font-medium">
                        {b.requestedDate ? `${b.requestedDate} ${b.requestedStartTime ?? ''}${b.requestedEndTime ? ' - ' + b.requestedEndTime : ''}` : '—'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Months</div>
                      <div className="font-medium">{b.requestedMonths?.join(', ') || '—'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Project Deadline</div>
                      <div className="font-medium">{b.projectDeadline || '—'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Accepted</div>
                      <div className="font-medium">
                        {b.acceptedDate ? `${b.acceptedDate}${b.acceptedTime ? ' ' + b.acceptedTime : ''}` : '—'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Pricing</div>
                      <div className="font-medium">
                        {b.selectedPricingType || '—'} {b.selectedPricingPrice ? `• ${b.selectedPricingPrice}` : ''}
                      </div>
                    </div>
                  </div>
                  {b.projectDetails && (
                    <div className="mt-4">
                      <div className="text-gray-500 text-sm mb-1">Project Details</div>
                      <div className="text-gray-800 text-sm whitespace-pre-line">{b.projectDetails}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-500">No details available</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceListTabs;