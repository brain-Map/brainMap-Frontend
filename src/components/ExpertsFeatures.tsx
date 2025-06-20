import React from 'react';
import Link from 'next/link';

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
}

interface ExpertsFeaturesProps {
  className?: string;
  onJoinNow?: () => void;
  joinNowLink?: string;
}

const ExpertsFeatures: React.FC<ExpertsFeaturesProps> = ({
  className = '',
  onJoinNow,
  joinNowLink = '/signup'
}) => {
  const features: Feature[] = [
    {
      id: '1',
      title: 'Verified Domain Experts',
      icon: (
        <svg 
          className="w-12 h-12 text-gray-700" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M9 12l2 2 4-4" 
          />
        </svg>
      )
    },
    {
      id: '2',
      title: 'Task Tracking & Collaboration',
      icon: (
        <svg 
          className="w-12 h-12 text-gray-700" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="3" strokeWidth={1.5} />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M12 1v6m0 6v6m11-7h-6m-6 0H1" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      )
    },
    {
      id: '3',
      title: 'Real-time Chat & Video Calls',
      icon: (
        <svg 
          className="w-12 h-12 text-gray-700" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <rect 
            x="2" 
            y="3" 
            width="20" 
            height="14" 
            rx="2" 
            ry="2" 
            strokeWidth={1.5}
          />
          <line x1="8" y1="21" x2="16" y2="21" strokeWidth={1.5} />
          <line x1="12" y1="17" x2="12" y2="21" strokeWidth={1.5} />
          <circle cx="8" cy="9" r="2" strokeWidth={1.5} />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M16 7v6" 
          />
        </svg>
      )
    },
    {
      id: '4',
      title: 'Flexible & Secure Payments',
      icon: (
        <svg 
          className="w-12 h-12 text-gray-700" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <rect 
            x="1" 
            y="4" 
            width="22" 
            height="16" 
            rx="2" 
            ry="2" 
            strokeWidth={1.5}
          />
          <line x1="1" y1="10" x2="23" y2="10" strokeWidth={1.5} />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M9 16l2 2 4-4" 
          />
        </svg>
      )
    }
  ];

  const handleJoinNow = () => {
    if (onJoinNow) {
      onJoinNow();
    }
  };

  return (
    <section className={`py-16 px-4 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Make it all happen with Experts
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="text-center group"
            >
              {/* Icon Container */}
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-gray-100 transition-colors duration-300">
                  {feature.icon}
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          {onJoinNow ? (
            <button
              onClick={handleJoinNow}
              className="px-8 py-4 bg-blue-300 hover:bg-blue-400 text-gray-900 font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Join Now
            </button>
          ) : (
            <Link
              href={joinNowLink}
              className="inline-block px-8 py-4 bg-blue-300 hover:bg-blue-400 text-gray-900 font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Join Now
            </Link>
          )}
        </div>

      </div>
    </section>
  );
};

export default ExpertsFeatures;