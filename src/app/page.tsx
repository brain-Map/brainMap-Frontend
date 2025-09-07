'use client';

import React, { useState } from 'react';
import CustomButton from '../components/CustomButtonModel';
import JoinCommunity from '../components/JoinCommunity';
import ExpertsFeatures from '../components/ExpertsFeatures';
import ConnectLearnAchieveHero from '../components/ConnectLearnAchievePoster';
import PopularServices from '../components/Carousel'
import { ArrowRight, CheckCircle, Shield, Users,TrendingUp, Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext'; // Adjust the import path as necessary



const Home: React.FC = () => {


    const [searchQuery, setSearchQuery] = useState<string>('');
    const { user } = useAuth(); // Access the user from AuthContext
    const [email, setEmail] = useState('');
    const router = useRouter();

  const handleGetStarted = () => {
    console.log('Get started clicked');
  };

  const handleSubscribe = () => {
    console.log('Email subscription:', email);
  };

    
    const handleClick = (buttonName: string) => {

    console.log(`${buttonName} button clicked!`);
    if( buttonName === 'Get Started') {
      router.push('/search-experts');
    } else {
        router.push('/becomeamentor');

    }
  };

  // console.log(user);




  interface SuccessStory {
  id: string;
  title: string;
  image: string;
  alt: string;
  readMoreLink: string;
}

const successStories: SuccessStory[] = [
  {
    id: '1',
    title: 'Streamlining Product Development with Expert Mentorship',
    image: '/image/research-mentor.jpeg',
    alt: 'Team collaborating on project with mentor support',
    readMoreLink: '/success-stories/product-development'
  },
  {
    id: '2',
    title: 'Managing Complex Projects with Kanban Boards',
    image: '/image/group-progress.jpg',
    alt: 'Team tracking project progress with kanban boards',
    readMoreLink: '/success-stories/project-management'
  },
  {
    id: '3',
    title: 'Accelerating Startup Growth with Domain Expert Guidance',
    image: '/image/thesis-writing.jpg',
    alt: 'Entrepreneurs receiving expert feedback on business strategy',
    readMoreLink: '/success-stories/startup-growth'
  }
];

  return (

    <>
{/* Hero section */}

   <section className="relative min-h-screen flex items-center justify-center bg-secondary overflow-hidden">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/image/pexels-fauxels-3183183.jpg')`, // Replace with your image URL
        }}
      />

  

  {/* Dark Overlay (optional for readability) */}
  <div className="absolute inset-0 bg-black/75" />

  {/* Geometric Background Elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
    <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/3 to-accent/3 rounded-full blur-3xl" />
  </div>

  {/* Content Container */}
  <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
   
    {/* Main Heading */}
    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight text-balance">
      Connect with
      <span className="text-primary"> Industry <br /> Experts, </span>
      <span className="text-muted-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal">
        Who Drive Results
      </span>
    </h1>

    {/* Subheading */}
    <p className="text-lg sm:text-xl lg:text-2xl text-white mb-12 max-w-4xl mx-auto leading-relaxed text-pretty">
      Join a curated network of world-class professionals and unlock new opportunities for growth, collaboration,
      and innovation in your industry.
    </p>

    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
      <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-lg overflow-hidden transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-ring">
        <span className="flex items-center gap-3">
          Start Connecting
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </button>

      <button className="px-8 py-4 text-lg font-medium text-white border-2 border-border rounded-lg hover:bg-muted hover:border-primary/20 transition-all duration-300">
        Browse Experts
      </button>
    </div>
  </div>

  {/* Scroll Indicator */}
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-10">
    <div className="flex flex-col items-center">
      <span className="text-sm mb-2 font-light">Discover More</span>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </div>
</section>

{/* Hero section */}

    

<PopularServices className='mt-16'/>



{/* metor Join */}

<div className="py-16 min-h-screen bg-gray-50">
      {/* Top Section - Project Success Partner */}
      <div className="bg-white ">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left side - Image */}
            <div className="lg:w-1/2 h-auto">
              <div className="relative w-full  rounded-lg overflow-hidden shadow-lg">
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-center w-full h-full flex items-center justify-center">
                    <img
                      src="/image/3807471.jpg"
                      alt="Project Success Partner"
                      className="w-full h-full object-cover"/>

                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="lg:w-1/2 space-y-6">
              <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                  Your project success partner — anytime, anywhere.
                </h1>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Connect with verified domain experts for personalized project guidance, 
                  collaborate seamlessly in real-time with your team, and track your progress 
                  with powerful kanban boards and milestone tracking — all within a secure, 
                  intuitive platform designed to help any project succeed.
                </p>

                <CustomButton
                text="Learn More"
                backgroundColor="bg-primary"
                textColor="text-white"
                hoverBackgroundColor="hover:bg-secondary hover:text-black"
                icon={ArrowRight}
                onClick={() => handleClick('Get Started')}
              />



              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Become a Mentor */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto ">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left side - Content */}
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                Want to Become an Expert on brainMap?
              </h2>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                Share your expertise across any domain, guide teams and individuals 
                on their projects, and build your reputation while earning income on 
                BrainMap's trusted platform for project mentorship.
              </p>

              <CustomButton
                text="Join Now"
                backgroundColor="bg-primary"
                textColor="text-white"
                hoverBackgroundColor="hover:bg-secondary hover:text-black"
                icon={ArrowRight}
                onClick={() => handleClick('Join Now')}
              />

            </div>

            {/* Right side - Professional Image */}
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden shadow-xl">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                          <img
                      src="/image/becomeamentor.jpg"
                      alt="Project Success Partner"
                      className="w-full h-full object-cover"/>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  {/* mentor Join */}



{/* success strory */}
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What success on brainMap looks like
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real connections with verified experts, smarter project collaboration, 
            and a clear path toward your project goals — all within BrainMap.
          </p>
        </div>

        {/* Success Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {successStories.map((story) => (
            <div 
              key={story.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              {/* Image Container */}
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={story.image}
                  alt={story.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-tight">
                  {story.title}
                </h3>
                
                <Link 
                  href={story.readMoreLink}
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                >
                  Readmore
                  <svg 
                    className="ml-2 w-4 h-4" 
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>


  {/* success story */}


<JoinCommunity/>
<ExpertsFeatures/>
<ConnectLearnAchieveHero/>




    </>
  );
};

export default Home;