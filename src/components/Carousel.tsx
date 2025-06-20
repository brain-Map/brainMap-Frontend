import React, { useRef } from 'react';
import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  image?: string;
  description?: string;
  link?: string;
  
}

interface PopularServicesProps {
  className?: string;
  services?: Service[];
  showNavigation?: boolean;
  onServiceClick?: (service: Service) => void;
}

const PopularServices: React.FC<PopularServicesProps> = ({
  className = '',
  services,
  showNavigation = true,
  onServiceClick
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Default placeholder services if none provided
  const defaultServices: Service[] = [
    { id: '1', title: 'Academic Writing', link: '/services/academic-writing' },
    { id: '2', title: 'Research Assistance', link: '/services/research' },
    { id: '3', title: 'Data Analysis', link: '/services/data-analysis' },
    { id: '4', title: 'Thesis Support', link: '/services/thesis' },
    { id: '5', title: 'Literature Review', link: '/services/literature-review' },
    { id: '6', title: 'Statistical Analysis', link: '/services/statistics' },
    { id: '7', title: 'Presentation Design', link: '/services/presentations' },
    { id: '8', title: 'Proofreading', link: '/services/proofreading' },
    { id: '9', title: 'Proofreading', link: '/services/proofreading' },
    { id: '10', title: 'Proofreading', link: '/services/proofreading' },
    { id: '11', title: 'Proofreading', link: '/services/proofreading' }
  ];

  const displayServices = services || defaultServices;

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 1200; // w-50 = 200px
      const gap = 96; // gap-4 = 16px
      scrollContainerRef.current.scrollBy({
        left: cardWidth + gap,
        behavior: 'smooth'
      });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 1200;
      const gap = 96;
      scrollContainerRef.current.scrollBy({
        left: -(cardWidth + gap),
        behavior: 'smooth'
      });
    }
  };

  const handleServiceClick = (service: Service) => {
    if (onServiceClick) {
      onServiceClick(service);
    }
  };

  return (
    <section className={`py-12 px-4 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Popular Services
          </h2>
          
          {/* Navigation Arrows */}
          {showNavigation && (
            <div className="flex items-center space-x-2">
              <button
                onClick={scrollLeft}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                aria-label="Scroll left"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 19l-7-7 7-7" 
                  />
                </svg>
              </button>
              
              <button
                onClick={scrollRight}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-900 text-white transition-colors duration-200"
                aria-label="Scroll right"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Services Container */}
        <div className="relative ">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayServices.map((service) => (
              <div
                key={service.id}
                className="flex-shrink-0 w-50 h-50 group cursor-pointer"
                onClick={() => handleServiceClick(service)}
              >
                {service.link && !onServiceClick ? (
                  <Link href={service.link} className="block w-full h-full">
                    <ServiceCard service={service} />
                  </Link>
                ) : (
                  <ServiceCard service={service} />
                )}
              </div>
            ))}
          </div>
          
        </div>
      </div>
      
      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

// Service Card Component
interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="w-full h-full bg-gray-200 rounded-2xl hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center relative overflow-hidden group">
      {service.image ? (
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
        />
      ) : (
        // Placeholder content
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-gray-400 rounded-full mx-auto mb-3 group-hover:bg-gray-500 transition-colors duration-300"></div>
          <p className="text-sm font-medium text-gray-700 group-hover:text-gray-800">
            {service.title}
          </p>
          {service.description && (
            <p className="text-xs text-gray-500 mt-1">
              {service.description}
            </p>
          )}
        </div>
      )}
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-2xl"></div>
    </div>
  );
};

export default PopularServices;



// // Basic usage with default placeholder services
// <PopularServices />

// // With custom services
// <PopularServices 
//   services={[
//     { 
//       id: '1', 
//       title: 'Custom Service',
//       image: '/path/to/image.jpg',
//       description: 'Service description',
//       link: '/custom-service'
//     }
//   ]}
// />

// // With custom click handler
// <PopularServices 
//   onServiceClick={(service) => console.log('Clicked:', service)}
//   showNavigation={false}
// />

// // With additional styling
// <PopularServices className="bg-gray-50" />