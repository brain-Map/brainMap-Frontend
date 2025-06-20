import React from 'react';
import Link from 'next/link';

interface JoinCommunityProps {
  className?: string;
  onGetStarted?: () => void;
  getStartedLink?: string;
}

const JoinCommunity: React.FC<JoinCommunityProps> = ({ 
  className = '',
  onGetStarted,
  getStartedLink = '/signup'
}) => {
  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    }
  };

  return (
    <section className={`py-16 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black via-gray-900 to-indigo-900 p-12 lg:p-16">
          {/* Background Pattern/Decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-500 to-transparent rounded-full blur-3xl"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Join with
              <br />
              Community
            </h2>
            
            <p className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed">
              Be part of a growing academic community —
              <br />
              post your questions, collaborate on solutions,
              <br />
              and learn together with mentors and peers.
            </p>
            
            {/* CTA Button */}
            {onGetStarted ? (
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center px-8 py-4 bg-indigo-100 hover:bg-white text-gray-900 font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Get Started
                <svg 
                  className="ml-2 w-5 h-5" 
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
            ) : (
              <Link
                href={getStartedLink}
                className="inline-flex items-center px-8 py-4 bg-indigo-100 hover:bg-white text-gray-900 font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Get Started
                <svg 
                  className="ml-2 w-5 h-5" 
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
              </Link>
            )}
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-8 right-8 opacity-20">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <div className="absolute top-16 right-20 opacity-15">
            <div className="w-2 h-2 bg-indigo-300 rounded-full"></div>
          </div>
          <div className="absolute bottom-12 right-12 opacity-25">
            <div className="w-4 h-4 bg-purple-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinCommunity;