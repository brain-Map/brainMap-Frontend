import React, { useState, useEffect } from 'react';
import { X, MessageCircle, CreditCard } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import api from '@/utils/api';

type ServiceStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CONFIRMED';

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

};

const ServiceListTabs: React.FC = () => {
  const user = useAuth().user;
//   console.log("pakaya", user);
  const [activeTab, setActiveTab] = useState<ServiceStatus>('ACCEPTED');
  const [services, setServices] = useState<Service[]>([]);

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


  const filteredServices = services.filter(service => service.status === activeTab);

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
    // Add your payment logic here
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
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
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
                        onClick={() => handleMessage(service.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <MessageCircle size={18} />
                        Message
                      </button>
                      <button
                        onClick={() => handlePayment(service.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <CreditCard size={18} />
                        Payment
                      </button>
                      <button
                        onClick={() => handleCancel(service.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </>
                  ) : activeTab === 'COMPLETED' ? (
                    <button
                      onClick={() => handleMessage(service.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <MessageCircle size={18} />
                      Message
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleMessage(service.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <MessageCircle size={18} />
                        Message
                      </button>
                      <button
                        onClick={() => handleCancel(service.id)}
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
    </div>
  );
};

export default ServiceListTabs;