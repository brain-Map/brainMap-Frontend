import React from 'react';
import Link from 'next/link';

interface HeroSectionProps {
  className?: string;
  onGetStarted?: () => void;
  getStartedLink?: string;
}

interface CTASectionProps {
  className?: string;
  onGetStarted?: () => void;
  getStartedLink?: string;
}

// Hero Section Component
const ConnectLearnAchieveHero: React.FC<HeroSectionProps> = ({
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
    <section className={`py-12 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 p-8 lg:p-12">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 right-20 w-32 h-32 bg-green-300 rounded-full"></div>
            <div className="absolute bottom-16 right-32 w-24 h-24 bg-orange-400 rounded-full"></div>
            <div className="absolute top-32 right-12 w-16 h-16 bg-red-400 rounded-full"></div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-white">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Connect. Learn.
                <br />
                Achieve.
              </h1>
              
              <p className="text-lg lg:text-xl mb-8 opacity-90 leading-relaxed">
                Hire domain experts, manage your academic
                <br />
                tasks, and track your progress — from start to
                <br />
                finish.
              </p>
              
              {/* CTA Button */}
              {onGetStarted ? (
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
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
                  className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
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

            {/* Right Content - Phone Mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone Frame */}
                <div className="w-64 h-96 bg-gray-100 rounded-3xl p-2 shadow-2xl">
                  <div className="w-full h-full bg-gray-800 rounded-2xl flex flex-col items-center justify-center text-white relative overflow-hidden">
                    {/* Phone Notch */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-300 rounded-full"></div>
                    
                    {/* Upload Content */}
                    <div className="text-center px-6">
                      <p className="text-lg font-medium mb-2">Upload your</p>
                      <p className="text-lg font-medium mb-4">image here</p>
                      <div className="text-2xl mb-6">↓</div>
                      
                      {/* Decorative Elements */}
                      <div className="absolute bottom-8 left-4 w-20 h-3 bg-red-400 rounded-full transform rotate-12"></div>
                      <div className="absolute bottom-12 left-6 w-16 h-3 bg-orange-400 rounded-full transform rotate-12"></div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-400 rounded-full opacity-80"></div>
                <div className="absolute top-12 -right-2 w-6 h-6 bg-red-400 rounded-full opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// CTA Section Component
const ReadyToWorkCTA: React.FC<CTASectionProps> = ({
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
    <section className={`py-12 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8 lg:p-12">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="text-white">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Ready to work with us ?
              </h2>
            </div>

            {/* Right CTA Button */}
            <div className="flex-shrink-0">
              {onGetStarted ? (
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center px-8 py-4 bg-blue-200 hover:bg-blue-100 text-gray-900 font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
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
                  className="inline-flex items-center px-8 py-4 bg-blue-200 hover:bg-blue-100 text-gray-900 font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
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
          </div>
        </div>
      </div>
    </section>
  );
};

// Combined Component
interface CombinedSectionsProps {
  heroProps?: HeroSectionProps;
  ctaProps?: CTASectionProps;
  spacing?: string;
}

const ConnectLearnAchieveSections: React.FC<CombinedSectionsProps> = ({
  heroProps = {},
  ctaProps = {},
  spacing = 'space-y-8'
}) => {
  return (
    <div className={spacing}>
      <ConnectLearnAchieveHero {...heroProps} />
      <ReadyToWorkCTA {...ctaProps} />
    </div>
  );
};

export { ConnectLearnAchieveHero, ReadyToWorkCTA };
export default ConnectLearnAchieveSections;




// // Use individual components
// <ConnectLearnAchieveHero />
// <ReadyToWorkCTA />

// // Use combined component
// <ConnectLearnAchieveSections />

// // With custom props
// <ConnectLearnAchieveSections 
//   heroProps={{ getStartedLink: '/register' }}
//   ctaProps={{ onGetStarted: handleCTAClick }}
//   spacing="space-y-12"
// />

// // Individual with custom handlers
// <ConnectLearnAchieveHero 
//   onGetStarted={() => console.log('Hero CTA clicked')}
// />
// <ReadyToWorkCTA 
//   getStartedLink="/join"
// />